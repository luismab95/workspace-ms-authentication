export interface MenuInterface {
  remoteEntry: string;
  name: string;
  path: string;
  isAuthRoute: boolean;
  exposedModule: string;
  moduleName: string;
}

export interface ManifestInterface {
  [key: string]: MenuInterface;
}
