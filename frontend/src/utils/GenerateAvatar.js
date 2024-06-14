export const generateAvatar = () => {
  const data = [];
  const email = encodeURIComponent(localStorage.getItem('email'));

  data.push(`https://api.dicebear.com/8.x/avataaars/svg?seed=${email}`);
  data.push(`https://api.dicebear.com/8.x/micah/svg?seed=${email}`);
  data.push(`https://api.dicebear.com/8.x/miniavs/svg?seed=${email}`);
  data.push(`https://api.dicebear.com/8.x/personas/svg?seed=${email}`);
  data.push(`https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=${email}`);
  data.push(`https://api.dicebear.com/8.x/adventurer/svg?seed=${email}`);

  return data;
};
