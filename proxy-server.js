const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/gpt', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: '질문을 입력해야 합니다.' });
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: '넌 수학 선생님이야. 고등학생에게 실전 수학 문제 풀이를 단계별로 설명해줘.' },
        { role: 'user', content: question },
      ],
    }, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    // 응답 전체를 그대로 반환
    res.json({ raw_openai_response: response.data });
  } catch (err) {
    console.error('[GPT Proxy Error]', err.message);
    res.status(500).json({ error: 'GPT 서버 요청 실패', message: err.message, stack: err.response?.data });
  }
});

app.listen(PORT, () => {
  console.log(`✅ GPT 프록시 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
