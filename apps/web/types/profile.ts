
export type ProfileType = {
  id: number | null;
  userId: number | null ;
  nickName: string | null;
  gender: "M" | "F" | null;
  birthDate: string | null;
  height: number | null;
};  

export type getNickNameResponse = {
  nickName: string;
}

export type ProfileResponse = {
  profile: ProfileType;
};