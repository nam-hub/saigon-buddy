
import { SaigonLocation, UserProfile } from './types';

export const INITIAL_PROFILE: UserProfile = {
  name: '',
  buddyName: 'Buddy',
  mode: 'Teen',
  mood: 'Bình thường 😐',
  strengths: [],
  weaknesses: [],
  interests: [],
  dislikes: [],
  lastUpdate: new Date().toLocaleDateString('vi-VN'),
};

export const SAIGON_LOCATIONS: SaigonLocation[] = [
  {
    id: 'ndc',
    name: 'Nhà thờ Đức Bà',
    lat: 10.7797,
    lng: 106.6990,
    year: '1877-1880',
    shortDesc: 'Biểu tượng kiến trúc Romanesque-Gothic giữa lòng Quận 1.',
    fullDesc: 'Do kiến trúc sư Pháp thiết kế, hoàn thành 1880, là nhà thờ Công giáo lớn nhất Sài Gòn. Toàn bộ vật liệu từ gạch đến chuông đều mang từ Pháp sang.',
    imagePrompt: 'Notre Dame Cathedral of Saigon, pinkish brick walls, sunset lighting, Paris Square perspective',
    tips: 'Ngồi cà phê bệt đối diện ngắm cảnh hoặc chụp hình vào buổi chiều nắng vàng cực đẹp.',
    category: 'historical'
  },
  {
    id: 'cbt',
    name: 'Chợ Bến Thành',
    lat: 10.7725,
    lng: 106.6980,
    year: '1912-1914',
    shortDesc: 'Biểu tượng thương mại lâu đời với tháp đồng hồ đặc trưng.',
    fullDesc: 'Một trong những biểu tượng nổi tiếng nhất của TP.HCM. Chợ có 4 cửa chính hướng ra các con đường trung tâm và là nơi hội tụ văn hóa ẩm thực Sài Gòn.',
    imagePrompt: 'Ben Thanh Market clock tower, bustling street, classic Saigon vibe',
    tips: 'Hãy thử súp cua hoặc bún riêu bên trong chợ, hương vị rất đặc trưng.',
    category: 'historical'
  },
  {
    id: 'bitexco',
    name: 'Tòa nhà Bitexco',
    lat: 10.7717,
    lng: 106.7043,
    year: '2010',
    shortDesc: 'Tòa tháp búp sen biểu tượng cho sự phát triển của thành phố.',
    fullDesc: 'Từng là tòa nhà cao nhất Việt Nam, Bitexco nổi bật với sân đậu trực thăng vươn ra ngoài và đài quan sát Saigon Skydeck.',
    imagePrompt: 'Bitexco Financial Tower, lotus bud shape, neon lights at night, Saigon skyline',
    tips: 'Lên tầng 49 để ngắm toàn cảnh Sài Gòn từ trên cao, đặc biệt lung linh khi phố lên đèn.',
    category: 'modern'
  },
  {
    id: 'l81',
    name: 'Landmark 81',
    lat: 10.7946,
    lng: 106.7218,
    year: '2018',
    shortDesc: 'Tòa nhà cao nhất Việt Nam, niềm tự hào của Sài Gòn hiện đại.',
    fullDesc: 'Lấy cảm hứng từ bó tre truyền thống, Landmark 81 là trung tâm của khu Vinhomes Central Park với kiến trúc xanh và hiện đại.',
    imagePrompt: 'Landmark 81 skyscraper, modern bamboo bunch architecture, reflection in Saigon river',
    tips: 'Công viên Vinhomes ngay dưới chân tòa nhà là nơi cực chill để dạo bộ buổi tối.',
    category: 'modern'
  },
  {
    id: 'nhanh',
    name: 'Phố đi bộ Nguyễn Huệ',
    lat: 10.7741,
    lng: 106.7027,
    year: '2015',
    shortDesc: 'Quảng trường hiện đại, trung tâm vui chơi của giới trẻ.',
    fullDesc: 'Con phố hiện đại chạy dọc từ UBND Thành phố đến Bến Bạch Đằng, nơi diễn ra các lễ hội lớn và là điểm tập trung đông đúc mỗi tối.',
    imagePrompt: 'Nguyen Hue Walking Street, fountain show, city hall in background, crowds of people',
    tips: 'Ghé khu chung cư 42 Nguyễn Huệ để tìm những quán cà phê view "triệu đô" nhìn xuống phố.',
    category: 'modern'
  },
  {
    id: 'bbb',
    name: 'Bến Bạch Đằng',
    lat: 10.7728,
    lng: 106.7071,
    year: 'Cải tạo 2021',
    shortDesc: 'Công viên ven sông Sài Gòn mới lạ và lãng mạn.',
    fullDesc: 'Nơi đón gió sông Sài Gòn, đã được cải tạo với không gian đi bộ rộng rãi, kết nối với ga tàu thủy bus và cầu Thủ Thiêm 2.',
    imagePrompt: 'Bach Dang Wharf, river view, Thủ Thiêm bridge, breezy atmosphere',
    tips: 'Đi Water Bus từ đây đi Thanh Đa hoặc Thủ Đức để ngắm thành phố từ sông rất thú vị.',
    category: 'nature'
  }
];
