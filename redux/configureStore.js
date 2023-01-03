import { createStore, combineReducers, applyMiddleware } from "redux";
import { Auth } from "./auth";
import { User } from "./user";
import { Users } from "./usersget";
import { Signup } from "./signup";
import { Start } from "./start";
import { Inbox } from './inbox';
import { InboxFollows } from './inboxFollows';
import { Settings } from "./settings";
import { Notifications } from './notification';
import { Followers } from './followers';
import { Following } from './following';
import { Imagen } from './imagen';
import { Likes } from './likes';
import { Stories } from './stories';

import thunk from "redux-thunk";

export const ConfigureStore = () => {
  const store = createStore(
    combineReducers({
      auth: Auth,
      user: User,
      users: Users,
      signup: Signup,
      inbox: Inbox,
      inboxFollows: InboxFollows,
      start: Start,
      setings: Settings,
      notifications: Notifications,
      followers: Followers,
      following: Following,
      imagen: Imagen,
      likes: Likes,
      stories: Stories
    }),
applyMiddleware(thunk)
  );

  return store;
};
