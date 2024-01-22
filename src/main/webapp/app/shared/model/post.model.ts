import dayjs from 'dayjs';
import { IComment } from 'app/shared/model/comment.model';
import { IUser } from 'app/shared/model/user.model';

export interface IPost {
  id?: number;
  date?: dayjs.Dayjs | null;
  title?: string;
  content?: string;
  published?: boolean | null;
  comments?: IComment[] | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<IPost> = {
  published: false,
};
