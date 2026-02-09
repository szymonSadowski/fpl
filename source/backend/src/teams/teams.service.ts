import { Injectable } from '@nestjs/common';
import { FplClientService } from '../fpl-client/fpl-client.service';
import { Entry, EntryHistoryResponse, EntryPicks } from '../common/interfaces/fpl-entry.interface';

@Injectable()
export class TeamsService {
  constructor(private readonly fplClient: FplClientService) {}

  async getEntry(teamId: number): Promise<Entry> {
    return this.fplClient.getEntry(teamId);
  }

  async getEntryHistory(teamId: number): Promise<EntryHistoryResponse> {
    return this.fplClient.getEntryHistory(teamId);
  }

  async getEntryPicks(teamId: number, event: number): Promise<EntryPicks> {
    return this.fplClient.getEntryPicks(teamId, event);
  }
}
