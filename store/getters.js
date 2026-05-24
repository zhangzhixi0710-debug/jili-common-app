const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  id: state => state.user.id,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  direction: state => state.base.direction,
  isDesktop: state => state.base.isDesktop,
  gameToken: state => state.base.token
}
export default getters
