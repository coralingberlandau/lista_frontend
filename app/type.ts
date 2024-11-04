// types.ts
export type RootStackParamList = {
    Login: undefined;          // מסך הלוגין, אין לו פרמטרים
    Home: undefined // הוספת פרמטר אפשרי בשם refresh
    Register: undefined;
    // AddListItem: { onGoBack: () => Promise<void> }; // נוסיף את הפרמטרים כאן
    Settings: undefined;
    ListItemDetails?: { item: ListItem }; // פרמטר חדש עבור פרטי האייטם
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
  description: string[]; // מערך של תיאורים עם כל סעיף בנפרד
  user_id: string;
  is_active: boolean; // שדה המייצג אם הפריט פעיל
  images: string[]; // מערך של קישורים לתמונות
}

// הגדרת הממשק ListItem
export interface ListItem {
  id: number;
  title: string;
  description: string[];
  date_created: string;
  is_active: boolean;
}


declare module 'react-color'{

  export interface HsvColor {
    h: number; // Hue
    s: number; // Saturation
    v: number; // Value
  }

  export function hsvToHex(h: number, s: number, v: number): string;
  
}


// interface RegisterProps {
//   setIsLoggedIn: Dispatch<SetStateAction<boolean | null>>;
// }