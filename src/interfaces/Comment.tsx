export interface CommentDetail {
    firstName: string;
    lastName: string;
    content: string;
    idParentComment: number | null;
    idComment: number;
    timestamp: string;
    profilePictureUrl: string | null;
}