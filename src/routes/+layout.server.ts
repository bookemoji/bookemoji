export const load = (event) => {
  return {
    hasHero: event.url.pathname === "/",
  };
};
