export const state = {
  user: null,
  sub: localStorage.getItem("v2_sub") || ""
};

export function setUser(user) {
  state.user = user;
}

export function setSub(sub) {
  state.sub = sub;
  if (sub) localStorage.setItem("v2_sub", sub);
  else localStorage.removeItem("v2_sub");
}
