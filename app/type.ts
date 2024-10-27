// types.ts

export type RootStackParamList = {
    Login: undefined;          // מסך הלוגין, אין לו פרמטרים
    Home: undefined;          // דף הבית, גם אין לו פרמטרים
    Register: undefined;
    AddListItem: { onGoBack: () => Promise<void> }; // Update this line to accept parameters
    Settings: undefined;
    // דף ההרשמה
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
