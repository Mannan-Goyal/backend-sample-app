import axios, { AxiosInstance } from 'axios';

export namespace DyteAPI {
  interface Config {
    apiBase: string;
    orgId: string;
    apiKey: string;
  }

  export namespace Entities {
    export interface UserDetails {
      name: string;
      picture?: string;
    }

    // eslint-disable-next-line no-shadow
    export enum MeetingStatus {
      CREATED = 'CREATED',
      CLOSED = 'CLOSED',
      USED = 'USED',
      LIVE = 'LIVE',
    }

    export interface Meeting {
      id: string;
      title: string;
      roomName: string;
      status: MeetingStatus;
      createdAt: string;
    }

    export interface PresetObject {
      id: string;
      name: string;
      description: string;
      s3URL: string;
    }
  }

  export namespace RequestTypes {
    interface CreateMeetingAuthorization {
      waitingRoom?: boolean;
      closed?: boolean;
    }

    export interface GetMeetingsOptions {
      limit?: number;
      offset?: number;
    }
    export interface CreateMeetingOptions {
      title?: string;
      presetName?: string;
      authorization?: CreateMeetingAuthorization;
    }

    export interface GetPresetOptions {
      limit?: number;
      offset?: number;
    }

    interface AddParticipantOptionsBase {
      meetingId?: string;
      roomName?: string;
      clientSpecificId?: string;
      userDetails?: Entities.UserDetails;
    }

    interface AddParticipantWithRole extends AddParticipantOptionsBase {
      roleName: string;
    }

    interface AddParticipantWithPreset extends AddParticipantOptionsBase {
      presetName: string;
    }

    export type AddParticipantOptions =
      | AddParticipantOptionsBase
      | AddParticipantWithRole
      | AddParticipantWithPreset;
  }

  export namespace ResponseTypes {
    interface APIResponse {
      success: boolean;
      message?: string;
      error?: string;
      data?: any;
    }

    export interface CreateMeeting extends APIResponse {
      data: Entities.Meeting;
    }

    export interface AddParticipant extends APIResponse {
      data: {
        authResponse: {
          userAdded: boolean;
          authToken: string;
        };
      };
    }
    export interface GetPresets extends APIResponse {
      data: {
        total: number;
        presets: Entities.PresetObject[];
      };
    }

    export interface GetMeetings extends APIResponse {
      data: {
        meetings: Entities.Meeting[];
      };
    }
  }

  export class Controller {
    config: Config;

    requests: AxiosInstance;

    constructor(config: Config) {
        this.config = config;
        this.requests = axios.create({
            baseURL: config.apiBase,
            headers: {
                Authorization: `APIKEY ${config.apiKey}`,
            },
        });
    }

    async createMeeting(options: RequestTypes.CreateMeetingOptions) {
        const res = await this.requests.post(
            `/organizations/${this.config.orgId}/meeting`,
            options,
        );
        return res.data as ResponseTypes.CreateMeeting;
    }

    async addParticipantMID(options: RequestTypes.AddParticipantOptions) {
        const { meetingId, ...requestOptions } = options;
        const res = await this.requests.post(
            `/organizations/${this.config.orgId}/meetings/${meetingId}/participant`,
            requestOptions,
        );
        return res.data as ResponseTypes.AddParticipant;
    }

    async addParticipantRNA(options: RequestTypes.AddParticipantOptions) {
        const { roomName, ...requestOptions } = options;
        const res = await this.requests.post(
            `/organizations/${this.config.orgId}/rooms/${roomName}/participant`,
            requestOptions,
        );
        return res.data as ResponseTypes.AddParticipant;
    }

    async getPresets(options: RequestTypes.GetPresetOptions) {
        const res = await this.requests.get(
            `/organizations/${this.config.orgId}/presets`,
            {
                params: options,
            },
        );
        return res.data as ResponseTypes.GetPresets;
    }

    async getMeetings(options: RequestTypes.GetMeetingsOptions) {
        const res = await this.requests.get(
            `/organizations/${this.config.orgId}/meetings`,
            {
                params: options,
            },
        );
        return res.data as ResponseTypes.GetMeetings;
    }
  }
}

export function getApi() {
    return new DyteAPI.Controller({
        apiBase: process.env.DYTE_API_BASE,
        apiKey: process.env.DYTE_API_KEY,
        orgId: process.env.DYTE_ORG_ID,
    });
}
