# POCKET CHAMPION online v2.30

Bản này xóa hoàn toàn **Danh sách mod** trong sidebar trên cả desktop và mobile.

- Sidebar chỉ còn khu tra cứu Pokémon/build.
- Không hiện khối **Danh sách mod** nữa.
- Vẫn giữ **Bảng xếp hạng đóng góp build** ở trang chủ để người xem biết ai build nhiều.
- Thêm cache-busting `v=2.30` cho CSS/JS để trình duyệt không giữ giao diện cũ.
- Không ảnh hưởng tài khoản, build hay MongoDB.

---

# POCKET CHAMPION online v2.28

Bản này chỉnh giao diện tra cứu:

- Thêm nút **Tìm kiếm** cạnh ô nhập tên Pokémon.
- Người dùng nhập tên rồi bấm **Tìm kiếm** sẽ mở build nếu tìm được đúng tên hoặc chỉ có một kết quả.
- Đưa **Danh sách mod** xuống dưới danh sách Pokémon để trên mobile ưu tiên phần tra cứu/build.
- Xóa chữ/badge role dư như “mod - thêm tên + build” trong danh sách mod.
- Giữ màu tên và logo role để vẫn nhận diện được admin/mod/cameo.

---

# POCKET CHAMPION online v2.24

Bản này bỏ hẳn khối **Liên kết chính thức** bị trùng trong sidebar. Link chỉ còn ở phía trên trang và màn hình đăng nhập.

Ngoài ra đã thêm cache-busting cho CSS/JS để trình duyệt không giữ giao diện cũ.

# POCKET CHAMPION - Linh Thú Online

## Bản v2.20 mới

- Bỏ khối **Liên kết chính thức** trong sidebar bên trái vì phía trên đã có các nút Tải game / TikTok / Nhóm Facebook.
- Giữ lại các link chính thức ở phần đầu trang và màn hình đăng nhập.

- Đổi form build từ **6 ô Skill** sang **4 ô Skill**.
- Bật lại autocomplete/gợi ý skill trong 4 ô Skill, dựa trên danh sách move của Pokémon đang build.
- Vẫn không hiện hộp skill gợi ý riêng ngoài trang chi tiết; chỉ gợi ý ngay trong ô nhập skill.


- Thêm thư mục **Đội hình gợi ý của các hệ**: admin có thể up ảnh đội hình, nhập chú thích/ghi chú; người chơi bấm vào ảnh để xem đội hình phóng to.
- Ảnh đội hình được nén trước khi lưu: ảnh thu nhỏ dưới 80KB, ảnh xem đầy đủ dưới khoảng 520KB để web nhẹ hơn.
- Backup JSON của admin nay có thể kèm cả ảnh đội hình gợi ý để khôi phục sau này.
- Đã bỏ ô **Hệ / thuộc tính** trong form build và phần hiển thị build.
- Danh sách mặc định chỉ còn Pokémon dạng tiến hóa cuối Gen 1–9; skill chỉ nhập tên, không có mô tả và không hiện hộp gợi ý.



- Khóa lỗi chiếm quyền admin: tài khoản tự đăng ký **luôn luôn là `user`**, kể cả khi database đang trống.
- Admin được tạo/giữ bằng biến môi trường Render `ADMIN_USERNAME` + `ADMIN_PASSWORD` trước khi web mở public. Nếu tài khoản đó lỡ tồn tại nhưng chưa phải admin, server sẽ nâng lại thành admin bằng mật khẩu trong Render.
- Chỉ `admin` còn thấy nút **Đăng xuất**. User/Cameo/mod không có nút đăng xuất trong giao diện.
- Mở lại **đăng ký tự do**. Người mới tự đăng ký sẽ **luôn là `user`**, không còn cơ chế “tài khoản đầu tiên là admin”; admin có thể nâng quyền thành `cameo`/`mod`/`admin` trong **Quản lý tài khoản**.
- Thêm nút **Donate / Ủng hộ**. Admin có thể bật/ẩn, tải lên 1 ảnh donate/QR, nhập STK và tên ngân hàng. Người xem có nút copy STK và copy tên ngân hàng.
- Thêm quyền `cameo`: được build linh thú, chỉ sửa build của chính mình, không được thêm/sửa/xóa tên linh thú.
- `mod` được thêm tên linh thú để tự build, không cần chờ admin thêm trước.
- `mod` vẫn không được sửa/xóa tên linh thú cũ và không được xóa tất cả; các quyền quản trị tên/xóa toàn bộ vẫn thuộc `admin`.
- `admin` vẫn toàn quyền: quản lý tài khoản, đổi quyền user/cameo/mod/admin, sửa/xóa tên linh thú, xóa build troll, backup/restore.
- Bảng danh sách người đóng góp và bảng xếp hạng tính cả `cameo`, `mod` và `admin`.
- Cameo/mod/admin đều có thể đổi avatar để người chơi nhận diện người build.

Bản online có:

- Đăng nhập hoặc đăng ký tài khoản tự do. Tài khoản mới mặc định là `user` chỉ tra cứu; admin có thể tạo tài khoản hoặc nâng quyền cho người chơi/mod.
- Dữ liệu linh thú lưu trên MongoDB, mở máy nào cũng thấy sau khi đăng nhập.
- Phân quyền:
  - `user`: chỉ tra cứu.
  - `cameo`: tra cứu và build trên tên linh thú đã có, chỉ sửa build do chính mình tạo.
  - `mod`: tra cứu, thêm tên linh thú để build, tạo/sửa build của chính mình.
  - `admin`: toàn quyền, gồm quản lý tài khoản, thêm/sửa/xóa danh sách tên linh thú, sửa/xóa mọi build và đặt tên trong game cho người build.
- Nhiều Cameo/mod/admin có thể cùng build một linh thú đã được admin thêm tên. Ví dụ `Pikachu` có thể có build của Mod A và build của Mod B.
- Mỗi build hiển thị rõ **người build**.
- Có bảng **Danh sách người build** công khai để mọi người thấy avatar, tên trong game, quyền và số build của từng mod/admin.
- Có khu **Liên kết chính thức** hiển thị nổi bật ở màn hình đăng nhập và đầu trang: link tải game, TikTok, Facebook nhóm game.
- Admin có thể nhập/sửa `Tên trong game` trong phần **Quản lý tài khoản**.
- Cameo/mod/admin có thể tự đổi avatar. Ảnh sẽ được resize còn 128×128 và backend giới hạn dưới 40KB/avatar để web nhẹ kể cả khi có nhiều mod.
- Mật khẩu được giới hạn 6–32 ký tự. Lưu ý: database chỉ lưu hash bcrypt, nên giới hạn này chủ yếu để dễ quản lý và an toàn, không phải vì mật khẩu dài làm tốn nhiều dung lượng.
- Mỗi linh thú có tên, vai trò, tính cách, nội tại, 1–4 kỹ năng, ghi chú và 6 dòng chỉ số `HP / ATK / SATK / DEF / SDEF / SPE` tổng đúng 510 điểm.
- Nhập / xuất JSON để backup hoặc chuyển dữ liệu từ bản cũ.
- Donate và ảnh đội hình gợi ý được lưu trong MongoDB, không mất khi Render reload/redeploy.

## 1. Chạy thử trên máy

Cài Node.js 20+.

```bash
npm install
cp .env.example .env
npm run dev
```

Mở:

```txt
http://localhost:3000
```

Trong file `.env`, cần điền:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/pocket_champion?retryWrites=true&w=majority
JWT_SECRET=mot_chuoi_bi_mat_rat_dai_va_ngau_nhien
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ChangeMe123
ADMIN_DISPLAY_NAME=Admin
ADMIN_GAME_NAME=TenAdminTrongGame
ADMIN_RESET_PASSWORD_ON_START=false
```

## 2. Up lên GitHub

Upload toàn bộ file trong thư mục này lên repo GitHub. Không upload `node_modules`, không upload `.env`.

Cấu trúc đúng:

```txt
repo/
├── public/
├── src/
├── server.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 3. Tạo MongoDB Atlas

1. Vào MongoDB Atlas.
2. Tạo cluster miễn phí hoặc cluster phù hợp.
3. Tạo database user.
4. Network Access: cho phép Render kết nối. Khi mới test có thể dùng `0.0.0.0/0`, sau này nên siết lại nếu biết IP.
5. Lấy connection string dạng `mongodb+srv://...`.

## 4. Deploy trên Render

Render phải tạo **Web Service**, không phải Static Site.

Thông số gợi ý:

```txt
Service type: Web Service
Runtime: Node
Build Command: npm install
Start Command: npm start
```

Environment variables trên Render:

```env
MONGO_URI=<connection string MongoDB Atlas>
JWT_SECRET=<chuoi bi mat dai>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<mat khau admin manh>
ADMIN_DISPLAY_NAME=Admin
ADMIN_GAME_NAME=<ten trong game cua admin, co the de trong>
ADMIN_RESET_PASSWORD_ON_START=false
```

Sau khi deploy xong, server sẽ tạo hoặc bảo vệ tài khoản admin theo `ADMIN_USERNAME`. Tài khoản tự đăng ký bên ngoài luôn mặc định là `user`, nên không thể chiếm admin kể cả khi web vừa deploy lại.

## 5. Chống mất quyền admin

- Render restart/redeploy không làm mất quyền admin nếu bạn đang dùng đúng `MONGO_URI`, vì tài khoản nằm trong MongoDB.
- Nếu MongoDB còn dữ liệu, admin cũ vẫn là admin sau khi server khởi động lại.
- Nếu database bị xóa hoặc bạn đổi sang database trống, server sẽ tạo lại admin từ `ADMIN_USERNAME` và `ADMIN_PASSWORD` trong Render trước khi người ngoài đăng ký.
- Người chơi tự đăng ký không bao giờ được tự lên admin.
- Nếu quên mật khẩu admin, tạm đặt `ADMIN_RESET_PASSWORD_ON_START=true` trong Render rồi deploy lại để reset mật khẩu admin về `ADMIN_PASSWORD`. Sau khi đăng nhập được, đổi lại thành `false`.

## 6. Cách dùng quyền Cameo/mod/admin

- Tài khoản `user`: chỉ xem/search/copy build.
- Tài khoản `mod`: được thêm build mới, chỉ sửa build do chính tài khoản đó tạo, và tự đổi avatar của mình.
- Tài khoản `admin`: sửa/xóa được mọi build, tạo tài khoản, đổi quyền, reset mật khẩu, đặt `Tên trong game` cho mod, và tự đổi avatar của mình.

Nếu Mod A tạo build `Rồng Lửa`, Mod B vẫn có thể tạo build `Rồng Lửa` riêng. Khi người chơi search `Rồng Lửa`, danh sách sẽ hiện cả hai build kèm tên người build.

## 7. Chuyển dữ liệu từ bản cũ

Nếu bản cũ đã có dữ liệu trong trình duyệt:

1. Mở bản web cũ.
2. Bấm **Xuất dữ liệu** để tải file JSON.
3. Mở bản online.
4. Đăng nhập tài khoản `mod` hoặc `admin`.
5. Bấm **Nhập JSON**.

Khi nhập JSON, dữ liệu sẽ được gắn chủ sở hữu là tài khoản đang nhập. Nếu tài khoản đó đã có build trùng tên linh thú, hệ thống sẽ cập nhật build của chính tài khoản đó, không ghi đè build của mod khác.

## 8. Lưu ý về mật khẩu và avatar

Mật khẩu được lưu dạng hash bằng bcrypt, admin không xem được mật khẩu gốc của người dùng. Nếu bạn bè quên mật khẩu, admin dùng nút **Reset mật khẩu** để đặt mật khẩu mới. Mật khẩu hợp lệ dài từ 6 đến 32 ký tự.

Avatar dành cho Cameo/mod/admin. Khi chọn ảnh, trình duyệt sẽ tự crop vuông, resize về 128×128 và nén thành JPG nhỏ. Server vẫn kiểm tra lại, chỉ nhận PNG/JPG/WebP hợp lệ và dung lượng sau nén tối đa 40KB.

## 9. Thêm link tải game / TikTok / Facebook nhóm

Mở file:

```txt
public/site-config.js
```

Sửa phần `url` của từng dòng. Ví dụ:

```js
window.POCKET_CHAMPION_LINKS = [
  {
    id: 'download',
    label: 'Tải game',
    url: 'https://link-tai-game-cua-ban.com',
    description: 'Link tải game POCKET CHAMPION',
    icon: '🎮'
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    url: 'https://www.tiktok.com/@tenkenhcuaban',
    description: 'Kênh TikTok của bạn',
    icon: '🎵'
  },
  {
    id: 'facebook',
    label: 'Nhóm Facebook',
    url: 'https://www.facebook.com/groups/nhomcuaban',
    description: 'Nhóm cộng đồng game',
    icon: '👥'
  }
];
```

Sau khi sửa xong, push lên GitHub. Render sẽ deploy lại và các nút link sẽ bấm được. Nếu `url` còn để trống, nút sẽ hiện mờ và chưa bấm được.



## Cập nhật v2.6

- Giao diện hiển thị song ngữ cho các mục quan trọng: Nội tại (Ability), Tính cách (Nature), Kỹ năng (Skills), Berry / Chỉ số 510 điểm, Ghi chú (Notes).
- Form build có cố định 4 ô Skill để Cameo/mod/admin điền; ô chưa dùng có thể để trống.
- Khi bấm vào một bài build, trang chi tiết luôn hiện đủ 4 slot Skills cùng Ability, Nature, Berry và Notes.
- Copy build cũng dùng nhãn song ngữ để người chơi dễ hiểu hơn.


## Cập nhật v2.7

- Admin có nút **Sao lưu dữ liệu** để tải file backup JSON gồm danh sách tên linh thú, toàn bộ bài build và thông tin người build. File backup không chứa mật khẩu gốc.
- Admin có nút **Khôi phục backup** để nhập lại file JSON khi cần phục hồi dữ liệu.
- Khi khôi phục, web sẽ hỏi:
  - **OK**: xóa tên linh thú/build hiện tại rồi khôi phục từ file backup.
  - **Cancel**: nhập chồng/cập nhật, không xóa dữ liệu cũ.
- Nếu file backup có bài build của mod/admin cũ mà tài khoản đó chưa tồn tại, hệ thống sẽ tạo lại tài khoản mod/admin tạm để giữ tên người build. Admin có thể reset mật khẩu cho tài khoản đó trong **Quản lý tài khoản**.
- Admin có thể xóa trực tiếp từng bài build ở màn hình chi tiết bằng nút **Xóa build**, tiện xử lý các build troll/sai dữ liệu.

Khuyến nghị: sau mỗi đợt thêm/sửa nhiều build, admin nên bấm **Sao lưu dữ liệu** và lưu file JSON vào Google Drive hoặc máy tính cá nhân.


## Cập nhật v2.13

- Tự nhập sẵn **568 Pokémon tiến hóa cuối Gen 1-9** vào danh sách tên linh thú.
- Dữ liệu vẫn có danh sách **skill/move name** nội bộ, nhưng giao diện không hiện hộp gợi ý skill riêng.
- Đã bỏ hoàn toàn mô tả skill; form build chỉ có 4 ô nhập **tên skill**.
- Khi mở trang một Pokémon tiến hóa cuối, người xem chỉ thấy các bài build đã được tạo, không thấy hộp skill gợi ý.
- Admin có thêm nút **Nhập sẵn Pokémon tiến hóa cuối Gen 1-9** trong mục **Quản lý tên linh thú** để cập nhật lại danh sách bất cứ lúc nào.
- Server sẽ tự seed Pokémon tiến hóa cuối khi khởi động nếu chưa có dữ liệu. Có thể tắt bằng biến môi trường `AUTO_SEED_POKEMON=false`.

Nguồn dữ liệu tên Pokémon tiến hóa cuối và move name được lấy từ bộ CSV công khai của PokéAPI. Pokémon một hệ tiến hóa duy nhất/không tiến hóa tiếp vẫn được tính là dạng cuối.


## Thay đổi v2.15

- Bỏ hoàn toàn ô **Hệ / thuộc tính (Element)** khỏi form build.
- Khi xem/copy/sao lưu build không còn hiển thị/lưu trường hệ/thuộc tính nữa.

## v2.17

- Trang chủ và danh sách bên trái chỉ hiển thị Pokémon đã có ít nhất 1 bài build.
- User thường khi search cũng chỉ thấy Pokémon đã có build; Cameo/mod/admin vẫn search được tên chưa build để tạo build mới.
- Thêm nút **Trang chủ** ở đầu trang để quay về màn hình chính, xóa tìm kiếm và bỏ chọn linh thú/người build.


## Thay đổi v2.19

- Chỉ còn **4 ô Skill** trong form build và trang xem build.
- 4 ô Skill có `autocomplete`/gợi ý move name theo Pokémon đang được chọn.
- Backend cũng giới hạn mỗi build tối đa 4 skill để dữ liệu đồng bộ.

## v2.21

- Tối ưu bố cục mobile.
- Header gọn hơn trên điện thoại.
- Các nút chức năng ở đầu trang chuyển thành thanh cuộn ngang để không chiếm quá nhiều chiều cao.
- Sidebar, danh sách Pokémon, danh sách mod và khung build được giảm padding/bo góc để dễ đọc trên màn hình nhỏ.
- Form build/dialog dễ thao tác hơn trên mobile; nút lưu/hủy dính dưới màn hình khi đang nhập.
- Berry/stat editor hiển thị 2 cột trên điện thoại, 1 cột trên màn hình rất nhỏ.



## v2.24

- Cameo/mod/admin đổi avatar, avatar sau nén tối đa 256KB.
- Admin/mod/cameo có màu tên và logo role riêng.
- Admin có mục Custom role trong Quản lý tài khoản để chỉnh tên role, màu role, logo role và quyền nền.
- Role custom có thể dùng quyền nền user / Cameo / mod / admin để dễ tùy biến sau này.


## v2.26 - Cấu hình tiêu đề/mô tả trang đăng nhập

Có thể đổi tiêu đề và mô tả ở màn hình đăng nhập/trang chính trong file `public/site-config.js`:

```js
window.POCKET_CHAMPION_TEXT = {
  documentTitle: 'POCKET CHAMPION - Tra cứu build',
  authTitle: 'Tra cứu build linh thú online',
  authSubtitle: 'Đăng nhập hoặc tự tạo tài khoản để tra cứu...',
  heroTitle: 'Tra cứu build linh thú',
  heroSubtitle: 'Admin/mod có thể thêm tên linh thú...'
};
```

Sửa chữ xong thì push lên GitHub, Render sẽ deploy lại.


## v2.28 - Nút reload web

- Thêm nút **🔄 Reload web** cho tất cả người dùng.
- Nút reload xuất hiện ở màn hình đăng nhập và thanh nút chính sau khi đăng nhập.
- Dùng khi web bị lag/chậm trên Render Free hoặc trình duyệt giữ trạng thái cũ.


## v2.28

- Thêm ô **Nhập lại mật khẩu** khi người chơi tự tạo tài khoản.
- Thêm ô **Nhập lại mật khẩu** khi admin tạo tài khoản cho bạn bè.
- Backend kiểm tra password và confirmPassword phải trùng nhau trước khi tạo tài khoản.


## v2.29

- Xóa hoàn toàn khối **Danh sách mod** trong sidebar để trang tra cứu gọn hơn.
- Vẫn giữ dữ liệu mod/admin/cameo cho bảng xếp hạng đóng góp ở trang chủ.
- Không ảnh hưởng build và tài khoản trong MongoDB.


## v2.31

- Thêm nút **Thông báo thêm Pokémon** cho admin.
- Admin xem được mod/admin nào đã thêm Pokémon/linh thú mới, thời gian thêm và số build hiện có.
- Mặc định không hiện 568 Pokémon seed sẵn để tránh spam thông báo.
