export interface Comment {
  id: string;
  from: string;
  text: string;
  timestamp: Date;
}

export interface KeluhPost {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: Date;
  loveCount: number;
  comments: Comment[];
}
