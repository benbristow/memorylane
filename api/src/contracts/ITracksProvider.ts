import { ITrack } from "../models/ITrack";

export interface ITracksProvider {
  getTracksForYear(year: number): Promise<ITrack[]>;
}