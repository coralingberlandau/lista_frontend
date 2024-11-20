import { ImageSourcePropType } from "react-native";

export type RootStackParamList = {
  Login: undefined;  
  Home: undefined 
  Register: undefined;
  Settings: undefined;
  ListItemDetails?: { listItem: ListItem }; 
  ResetPassword: undefined; 
  EditProfile: { userId: string } | undefined; 
  ChangePassword: { email: string };
};

export interface RouteParams {
  email?: string;
};

export interface JwtPayload {
  exp: number;
  iat: number;
  jti: string;
  token_type: string;
  user_id: number;
  username: string;
}

export interface ListItemProps {
  title: string;
  items: string;
  user_id: string;
  is_active: boolean; 
}

export interface ListItem {
  id: number;
  title: string;
  items: string;
  date_created: string;
  is_active: boolean;
}

export interface GroupListResponse {
  message: string;
  data: {
    id: number;
    user: number;
    list_item: number;
    date_joined: string;
    role: string;
    permission_type: string;
  };
}

export interface Image {
  uri: string;
  name: string;
  type: string;
}

export interface User {
  id: number
}

export interface ListItemImage {
  id: number;
  list_item: number; 
  image: string; 
  uri: string;
  fileName: string;
  mimeType: string;
  index: number;
}

export interface ImageData {
  id: number;
  uri: string;
  fileName: string;
  mimeType: string;
  index: number;
  largeImage: string;  
}

export interface BackgroundImage {
  id: number;
  url: ImageSourcePropType; 
};
