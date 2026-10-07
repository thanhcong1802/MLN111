# Website Chương 2 – Chủ nghĩa duy vật biện chứng

## Công nghệ
- Frontend: React + Vite
- Backend: Node.js + Express
- Tổ chức backend theo MVC: routes → controllers → models → JSON data
- Không SQL, không đăng nhập

## Chức năng
1. Sơ đồ tư duy tóm tắt 8 phần
2. 40 flashcard lật thẻ
3. Ngân hàng 200 câu ABCD; mỗi lượt lấy ngẫu nhiên 30 câu và trộn đáp án
4. Chấm điểm phía server

## Chạy project
Mở terminal tại thư mục gốc:
```bash
npm install
npm run install:all
npm run dev
```
Frontend: http://localhost:5173
API: http://localhost:3001

## Deploy len Vercel

Tao hai Vercel project tu cung repository:

| Setting | Backend | Frontend |
| --- | --- | --- |
| Root Directory | server | client |
| Framework Preset | Express | Vite |
| Install Command | npm install | npm install |
| Build Command | Mac dinh | npm run build |
| Output Directory | Mac dinh | dist |

1. Deploy backend truoc. Mo https://<backend-domain>/api/health va /api/content/flashcards de kiem tra API va du lieu JSON.
2. Trong Environment Variables cua frontend, dat VITE_API_URL=https://<backend-domain> (khong them /api).
3. Deploy frontend. Neu doi VITE_API_URL, can redeploy vi Vite doc bien nay khi build.
4. Kiem tra Flashcard, Quiz, nop bai va refresh truc tiep /quiz.

client/vercel.json ho tro React Router khi refresh. server/vercel.json dong goi data/** cho API.
Local van chay bang npm run dev; neu khong dat VITE_API_URL, frontend goi http://localhost:3001.
