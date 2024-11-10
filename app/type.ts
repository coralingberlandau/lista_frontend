// types.ts
export type RootStackParamList = {
  Login: undefined;          // מסך הלוגין, אין לו פרמטרים
  Home: undefined // הוספת פרמטר אפשרי בשם refresh
  Register: undefined;
  Settings: undefined;
  ListItemDetails?: { listItem: ListItem }; // פרמטר חדש עבור פרטי האייטם
  // הוסף כאן מסכים נוספים לפי הצורך
};

export type JwtPayload = {
  exp: number;
  iat: number;
  jti: string;
  token_type: string;
  user_id: number;
  username: string;
}

// types.ts
export interface ListItemProps {
  title: string;
  items: string;
  user_id: string;
  is_active: boolean; // שדה המייצג אם הפריט פעיל
}

// הגדרת הממשק ListItem
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


declare module 'react-color' {

  export interface HsvColor {
    h: number; // Hue
    s: number; // Saturation
    v: number; // Value
  }

  export function hsvToHex(h: number, s: number, v: number): string;

}

export interface Image {
  uri: string;
  name: string;
  type: string;
}

export interface User {
  id: number
}

// interface RegisterProps {
//   setIsLoggedIn: Dispatch<SetStateAction<boolean | null>>;
// }