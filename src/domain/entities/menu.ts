export interface MenuI {
  remoteEntry: string;
  name: string;
  path: string;
  isAuthRoute: boolean;
  exposedModule: string;
  moduleName: string;
}

export interface ManifestI {
  [key: string]: MenuI;
}
