export interface Translation {
  moduleId: string;
  moduleName: string;
}

export interface TranslationModule {
  id?: string;
  name: string;
  version: string;
  description: string;
  versionDate: Date;
  logable: boolean;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  lastChanged: string;
}
