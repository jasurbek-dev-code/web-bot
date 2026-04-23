const rawBaseUrl = import.meta.env.NEXT_PUBLIC_BASE_URL?.trim() || '';

// Regex tekshiruvini olib tashladik, chunki u ba'zi domèn va yo'llarni noto'g'ri bloklab,
// Axios ni nisbiy yo'l (ya'ni frontend domèniga) so'rov yuborishiga sabab bo'layotgan bo'lishi mumkin.
const BASE_URL = rawBaseUrl;

export { BASE_URL };
