import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, type Repository } from 'typeorm';

import { AuthSessionModel } from '../models/auth-session.model';

/**
 * The service that manages auth sessions.
 */
@Injectable()
export class AuthSessionService {
  /**
   * The model repository.
   */
  @InjectRepository(AuthSessionModel)
  private readonly models!: Repository<AuthSessionModel>;

  /**
   * Returns an active session with the given ID.
   *
   * @param sessionId
   * The session ID.
   *
   * @param currentTime
   * The current time. If not set, `new Date()` will be used.
   *
   * @returns
   * A session model or `null` if there is no such a session.
   */
  public async findActiveById(
    sessionId: number,
    currentTime = new Date(),
  ): Promise<AuthSessionModel | null> {
    return this.models.findOneBy({
      id: sessionId,
      expiresAt: LessThan(currentTime),
    });
  }
}
