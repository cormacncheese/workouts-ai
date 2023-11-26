export const moderateText = async (text: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}api/moderate`,
    {
      method: 'POST',
      body: JSON.stringify({ text })
    }
  ).catch((err) => {
    console.log('err ', err);
    throw err; // re-throw the error after logging
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  const accepted = data.response;

  return accepted;
};
