module.exports = {
  /**
   * 系统名称
   */
  title: 'Vue Admin Template',
  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,
  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,
  /**
   * 是否显示logo 背景跟随菜单栏时
   */
  showLogo: false,
  /**
   * 是否显示页签
   */
  tagsView: true,
  /**
   *  是否logo背景是否跟随菜单栏
   */
  logoFollowMenu: false,
  /**
   * 是否菜单栏彩色图标
   */
  fullIcon: false,
  /**
   * 页签模式，0为阴影内嵌卡片模式，1为填充卡片模式,2为带Icon模式。3为圆点模式
   */
  tagType: "0",
  /**
   * 页签是否携带图标
   */
  hasTagIcon: true,
  /**
   * 是否开启菜单栏宽度自行调整
   */
  menuDrag: true,
  /**
   * 菜单栏默认打开
   */
  menuOpen: true,
  /**
   *  顶栏主题 共三种 dark：黑暗、light：亮色（白色）、customer：自定义色（根据主题色改变）
   */
  headerTheme: "customer",
  /**
   * 左侧菜单栏背景主题分为两种， dark：黑暗、light：亮色（白色）、
   */
  menuTheme: "light",
  /**
   * 导航模式。ll：分栏模式（最左侧出现根节点菜单），l：纵向模式（菜单位于左侧），lt: 顶部和左侧的混合模式, t: 顶部模式
   * // XXX 注意 分栏模式只有在logoFollowMenu为true的时候出现。t模式下logo和系统名也就是不能折叠菜单必定出现。
   */
  navigateType: "l",
  /**
   * 在导航模式为ll和lt时候，时候隐藏根节点的标题
   */
  isShowMenuTitleByllt: false,
  /**
   * 综合模式（lt）下。根节点icon和title排版true为左右排版。false为上下排版
   */
  isLtRow: true
};
