import * as torm from 'typeorm';
import * as models from '../models';
import * as moment from 'moment';
import {
  OpenSessionInput,
  RescheduleInput,
  ListSessionOptions,
  CommonTimeFilter,
  SimpleTimeSelection,
  FindSessionInRangeOptions
} from '../types';

type TimeFilter = CommonTimeFilter | SimpleTimeSelection;

export class Sesi {
  private sessionRepo: torm.Repository<models.Sesi>;
  
  constructor (private connection: torm.Connection) {
    this.sessionRepo = this.connection.getRepository<models.Sesi>(models.Sesi);
  }

  public async sessionById (id: number) : Promise<models.Sesi> {
    return await this.sessionRepo.findOne(id, {
      relations: [ 'barbermen', 'forUser', 'addedBy' ]
    });
  }

  public async listSessionInRange(payload: FindSessionInRangeOptions) : Promise<models.Sesi[]> {
    let { start, end } = payload;
    let states = payload.states.map(s => models.SesiState[s])

    let query = this.connection.createQueryBuilder()
      .select('sesi')
      .from(models.Sesi, 'sesi')
      .leftJoinAndSelect("sesi.addedBy", "addedBy")
      .leftJoinAndSelect("sesi.forUser", "user")
      .leftJoinAndSelect("sesi.barbermen", "barbermen")
      .where("sesi.scheduledStartTime > :start", { start })
      .andWhere("sesi.scheduledStartTime < :end", { end })
      .orderBy("sesi.scheduledStartTime", "DESC");

    // Ignore state filter if states is empty.
    let result = (states.length == 0) 
      ? await query.getMany()
      : await query.andWhere("sesi.state IN (:states)", { states }).getMany();

    console.log(result)

    return result;
  }

  public async listSessionInSimpleRange(idCabang: number, payload: SimpleTimeSelection) {

  }

  /** 
   * Book the session.
  */
  public async openSession(payload: OpenSessionInput) : Promise<models.Sesi> {
    let end = await this.getEndTimeByPaketJasa(payload.idPaketJasa, payload.start);
    let sessionInput = {
      idCabang: payload.idCabang,
      idBarbermen: payload.idBarbermen,
      scheduledStartTime: payload.start,
      scheduledEndTime: end,
      idForUser: payload.idForUser,
      idAddedBy: payload.idAddedBy,
      idPaketJasa: payload.idPaketJasa,
      state: models.SesiState.SCHEDULED
    } as torm.DeepPartial<models.Sesi>;
    let session = this.sessionRepo.create(sessionInput);

    // If session.date > currentDate: throw Error;

    session = await this.sessionRepo.save(session);
    return session;
  }

  private async changeState(idSesi: number, state: models.SesiState) : Promise<models.Sesi> {
    let session = await this.sessionRepo.findOne(idSesi);
    session.state = state;
    await this.sessionRepo.save(session)
    return session;
  }

  public async cancelSession(idSesi: number) : Promise<models.Sesi> { 
    let session = await this.sessionRepo.findOne(idSesi);

    if (session.state == models.SesiState.DONE) {
      throw new Error('Session already ended. Revert it first');
    }
    if (session.state == models.SesiState.ONGOING) {
      throw new Error('Session already started. Revert it first');
    }
    return this.changeState(idSesi, models.SesiState.CANCELED);
  }

  public async startSession(idSesi: number) : Promise<models.Sesi> {
    let session = await this.sessionRepo.findOne(idSesi);

    if (session.state == models.SesiState.DONE) {
      throw new Error('Session already ended. Revert it first');
    }
    if (session.state == models.SesiState.CANCELED) {
      throw new Error('Session already cancelled. Revert it first');
    }
    if (session.state == models.SesiState.ONGOING) {
      // Just return the current session
      return session;
    }

    session.state = models.SesiState.ONGOING;
    session.executionStartTime = new Date();
    session.executionEndTime = null;
    session = await this.sessionRepo.save(session);
    return session;
  }

  public async endSession(idSesi: number) : Promise<models.Sesi> {
    let session = await this.sessionRepo.findOne(idSesi);

    if (session.state == models.SesiState.DONE) {
      throw new Error('Session already ended. Revert it first');
    }
    if (session.state == models.SesiState.CANCELED) {
      throw new Error('Session already cancelled. Revert it first');
    }
    if (session.state == models.SesiState.SCHEDULED) {
      throw new Error('Session not yet started. Start it first!');
    }

    if (!session.executionStartTime) {
      throw new Error(`Execution time is not defined ${session.executionStartTime}`);
    }
    session.state = models.SesiState.DONE;
    session.executionEndTime = new Date();
    
    // Add nominal based on package
    const repo = this.connection.getRepository<models.PaketJasa>(models.PaketJasa);
    const pj = await repo.findOne(session.idPaketJasa);
    // session.nominal = pj.harga;

    session = await this.sessionRepo.save(session);
    
    return session;
  }

  public async revertSession(idSesi: number) : Promise<models.Sesi> {
    let session = await this.sessionRepo.findOne(idSesi);
    session.state = models.SesiState.SCHEDULED;
    session.executionStartTime = null;
    session.executionEndTime = null;
    session = await this.sessionRepo.save(session);
    return session;
  }

  public async rescheduleSession(idSesi: number, payload: RescheduleInput) : Promise<models.Sesi> {
    let session = await this.sessionRepo.findOne(idSesi);
    let end = await this.getEndTimeByPaketJasa(session.idPaketJasa, payload.start);
    session.state = models.SesiState.SCHEDULED;
    session.scheduledStartTime = payload.start;
    session.scheduledEndTime = end;
    session.executionStartTime = null;
    session.executionEndTime = null;
    session = await this.sessionRepo.save(session);
    return session;
  }

  public async rateSession(idSesi: number, rating: number) : Promise<models.Sesi> {
    let session = await this.sessionRepo.findOne(idSesi);
    if (session.state != models.SesiState.DONE) {
      throw new Error('Session is not DONE.');
    }
    session.rating = rating;
    session = await this.sessionRepo.save(session);
    return session;
  }

  public async nextSession() : Promise<models.Sesi> {

    let sesi = await this.connection.createQueryBuilder()
      .select("sesi")
      .from(models.Sesi, "sesi")
      .where("sesi.scheduledStartTime > NOW()")
      .andWhere("sesi.state = 'SCHEDULED'")
      .orderBy('sesi.scheduledStartTime', 'ASC')
      .getOne()
    return sesi
  }

  public async lastSession() : Promise<models.Sesi> {

    let sesi = await this.connection.createQueryBuilder()
      .select("sesi")
      .from(models.Sesi, "sesi")
      .where("sesi.scheduledStartTime < NOW()")
      .andWhere("sesi.state = 'DONE'")
      .orderBy('sesi.executionEndTime', 'DESC')
      .getOne()    
    return sesi
  }

  public async countPerState() : Promise<any> {
    let result = await this.connection.createQueryBuilder()
      .select([
        "sesi.state",
        "COUNT(sesi.state) AS jumlah"
      ])
      .from(models.Sesi, "sesi")
      .groupBy("sesi.state")
      .getRawMany()

    let summary = result.reduce((acc, curr) => {
      acc[curr.sesi_state] = curr.jumlah
      return acc
    }, {})
    
    if (summary.SCHEDULED === undefined) { summary.SCHEDULED = 0 }
    if (summary.DONE === undefined) { summary.DONE = 0 }
    if (summary.ONGOING === undefined) { summary.ONGOING = 0 }
    if (summary.CANCELED === undefined) { summary.CANCELED = 0 }
  
    return summary
  }

  public async deleteSession(idSesi: number) : Promise<number> {
    await this.sessionRepo.delete(idSesi);
    return 1;
  }

  private async getEndTimeByPaketJasa(idPaketJasa: number, start: Date) {
    const em = await this.connection.createEntityManager();
    const paketJasa = await em.findOne<models.PaketJasa>(models.PaketJasa, idPaketJasa);
    let endTime = moment.default(start).add(paketJasa.estimasiWaktu, 'minutes').toDate();
    return endTime;
  }
}