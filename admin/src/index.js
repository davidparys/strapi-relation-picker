import pluginPkg from "../../package.json";
import RelationPicker from "./components/relationPicker/index";
import pluginId from "./pluginId";

export default (strapi) => {
  // const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
  const pluginDescription = "A relation picker for Strapi";

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon: pluginPkg.strapi.icon,
    id: pluginId,
    initializer: () => null,
    injectedComponents: [],
    isReady: true,
    leftMenuLinks: [],
    leftMenuSections: [],
    mainComponent: null,
    name: pluginPkg.strapi.name,
    preventComponentRendering: false,
    trads: {},
  };

  strapi.registerField({ type: "relationpicker", Component: RelationPicker });

  return strapi.registerPlugin(plugin);
};
