

export async function updateToken() {
  const refreshToken = localStorage.getItem('refToken');
  if (!refreshToken) {
    throw new  Error('реф токен ошибка');
  }
  const response = await fetch('https://serverrouter-9nqh.onrender.com/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken })
  })
  if (!response.ok) {
    throw new  Error('реф токен ошибка обновления');
  }

  const data = await response.json();
  console.log('НОВЫЙ НОВЫЙ НОВЫЙ НОВЫЙ accessToken:', data.accessToken);
  localStorage.setItem('accToken', data.accessToken);
  localStorage.setItem('refToken', data.refreshToken);
  return data.accessToken;
}