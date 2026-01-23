export const HARD_CHAT = {
    greeting: [
        {
            q: ["xin chào", "chào", "hello", "hi", "alo", "hey"],
            a: "Chào bạn 👋 Mình đang ở đây, bạn cần mình hỗ trợ gì không?",
        },
        {
            q: ["chào buổi sáng"],
            a: "Chào buổi sáng ☀️ Chúc bạn một ngày làm việc hiệu quả nha!",
        },
        {
            q: ["chào buổi tối"],
            a: "Chào buổi tối 🌙 Bạn cần tư vấn hay trò chuyện gì không?",
        },
    ],

    health: [
        {
            q: ["tôi bị đau đầu", "đau đầu", "nhức đầu"],
            a: "Đau đầu có thể do căng thẳng, thiếu ngủ hoặc làm việc với máy tính quá lâu. Bạn thử nghỉ ngơi, uống nước và tránh nhìn màn hình một lúc nhé.",
        },
        {
            q: ["hôm qua tôi bị đau đầu", "hôm qua đau đầu"],
            a: "Nếu hôm qua bạn bị đau đầu thì hôm nay nên theo dõi thêm. Nếu cơn đau lặp lại nhiều lần hoặc nặng hơn, bạn nên đi khám để kiểm tra kỹ hơn.",
        },
        {
            q: ["tôi chóng mặt", "choáng", "hoa mắt"],
            a: "Chóng mặt có thể do tụt huyết áp, thiếu nước hoặc mệt mỏi. Bạn nên ngồi nghỉ, uống nước và tránh đứng dậy đột ngột.",
        },
        {
            q: ["tôi bị sốt"],
            a: "Nếu bạn bị sốt, hãy nghỉ ngơi, uống nhiều nước và theo dõi nhiệt độ. Nếu sốt cao hoặc kéo dài, bạn nên đi khám sớm.",
        },
        {
            q: ["tôi mất ngủ"],
            a: "Mất ngủ thường do stress hoặc sử dụng điện thoại quá nhiều trước khi ngủ. Bạn nên ngủ đúng giờ và hạn chế dùng thiết bị điện tử buổi tối.",
        },
    ],

    date_time: [
        {
            q: ["hôm nay ngày mấy", "ngày mấy"],
            a: () => {
                const d = new Date();
                return `Hôm nay là ngày ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}.`;
            },
        },
        {
            q: ["hôm nay thứ mấy", "thứ mấy"],
            a: () => {
                const days = [
                    "Chủ nhật",
                    "Thứ hai",
                    "Thứ ba",
                    "Thứ tư",
                    "Thứ năm",
                    "Thứ sáu",
                    "Thứ bảy",
                ];
                return `Hôm nay là ${days[new Date().getDay()]}.`;
            },
        },
        {
            q: ["mấy giờ rồi", "giờ hiện tại"],
            a: () => {
                const d = new Date();
                return `Bây giờ là ${d.getHours()} giờ ${d.getMinutes()} phút.`;
            },
        },
    ],

    booking: [
        {
            q: ["đặt lịch", "tôi muốn đặt lịch", "đặt hẹn"],
            a: "Bạn muốn đặt lịch vào ngày nào và khung giờ nào? Mình sẽ hỗ trợ bạn.",
        },
        {
            q: ["hủy lịch", "hủy cuộc hẹn"],
            a: "Bạn cho mình biết lịch hẹn nào cần hủy nhé.",
        },
        {
            q: ["xem lịch hẹn"],
            a: "Hiện tại mình đang kiểm tra lịch hẹn cho bạn. Vui lòng chờ trong giây lát.",
        },
    ],

    system: [
        {
            q: ["hệ thống lỗi", "bị lỗi", "không hoạt động"],
            a: "Hiện hệ thống đang gặp sự cố tạm thời. Bạn vui lòng thử lại sau hoặc liên hệ bộ phận kỹ thuật.",
        },
        {
            q: ["chatbot bị ngu", "bot ngu"],
            a: "😅 Mình đang cố gắng học thêm mỗi ngày. Mong bạn thông cảm nhé!",
        },
    ],

    it: [
        {
            q: ["api key là gì"],
            a: "API key là một chuỗi dùng để xác thực khi ứng dụng của bạn gọi tới một dịch vụ bên ngoài.",
        },
        {
            q: ["lỗi 500", "500 internal server error"],
            a: "Lỗi 500 là lỗi phía server. Bạn nên kiểm tra log backend hoặc biến môi trường.",
        },
        {
            q: ["vercel thêm key được không"],
            a: "Bạn hoàn toàn có thể thêm API key trong Environment Variables trên Vercel.",
        },
        {
            q: ["fix lỗi api"],
            a: "Bạn hãy kiểm tra endpoint, method, header và API key trước nhé.",
        },
    ],

    casual: [
        {
            q: ["bạn là ai", "mày là ai"],
            a: "Mình là chatbot hỗ trợ, luôn sẵn sàng trả lời và trò chuyện cùng bạn 😄",
        },
        {
            q: ["bạn làm được gì"],
            a: "Mình có thể trả lời câu hỏi, hỗ trợ kỹ thuật, tư vấn và trò chuyện cùng bạn.",
        },
        {
            q: ["chán quá"],
            a: "Nếu bạn đang chán, mình có thể nói chuyện hoặc kể chuyện cho bạn nghe nè 😆",
        },
        {
            q: ["cảm ơn"],
            a: "Không có gì đâu ❤️ Rất vui được giúp bạn!",
        },
    ],

    fallback: {
        a: "Mình chưa hiểu rõ câu hỏi này 😅. Bạn thử hỏi theo cách khác nhé.",
    },
};
