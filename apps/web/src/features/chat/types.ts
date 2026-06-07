export type ChatMessage =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'philosopher'; text: string }
