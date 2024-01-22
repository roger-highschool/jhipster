import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { IPost } from 'app/shared/model/post.model';

export interface IComment {
  id?: number;
  date?: dayjs.Dayjs | null;
  content?: string;
  published?: boolean | null;
  user?: IUser | null;
  post?: IPost | null;
}

export const defaultValue: Readonly<IComment> = {
  published: false,
};
