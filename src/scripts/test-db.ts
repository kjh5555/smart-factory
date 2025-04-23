import { testConnection } from '../lib/db';

async function main() {
  console.log('데이터베이스 연결 테스트 시작...');
  const isConnected = await testConnection();
  
  if (!isConnected) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('테스트 실행 중 오류 발생:', error);
  process.exit(1);
}); 