export declare class ChatMessageDto {
    role: 'user' | 'model';
    text: string;
}
export declare class ChatAiDto {
    message: string;
    history?: ChatMessageDto[];
}
