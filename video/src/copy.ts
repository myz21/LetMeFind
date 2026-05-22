import copyJson from './copy.json';

export type SegmentCopy = {
  label: string;
  prompt: string;
  narration: string;
  title: string;
  cta: string;
};

export type VideoCopy = {
  short: SegmentCopy;
  long: SegmentCopy;
};

export const copy = copyJson as VideoCopy;
