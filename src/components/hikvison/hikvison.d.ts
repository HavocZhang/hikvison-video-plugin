interface WebControlOptions {
  szPluginContainer: string;
  iServicePortStart: number;
  iServicePortEnd: number;
  szClassId: string;
  cbConnectSuccess?: () => void;
  cbConnectError?: () => void;
  cbConnectClose?: (bNormalClose: boolean) => void;
}
interface cbIntegrationCallBackData {
  uuid: string;
  sequence: string;
  cmd: string;
  responseMsg: {
    type: number;
    msg: {
      wndId: number;
      result: number;
      cameraIndexcode: string;
      expand: string;
    };
  };
}
interface JS_SetWindowControlCallback {
  cbIntegrationCallBack: (data: cbIntegrationCallBackData) => void;
}
declare class WebControl {
  constructor(option: WebControlOptions) {}
  async JS_StartService(
    cmd: string,
    options: {
      dllPath: string;
    }
  ) {}
  async JS_CreateWnd(cmd: string, width: number, height: number) {}
  JS_SetWindowControlCallback(
    JS_SetWindowControlCallback: JS_SetWindowControlCallback
  ) {}
  JS_WakeUp(path: string) {}
  JS_HideWnd() {}
  async JS_Disconnect() {}
  async JS_RequestInterface(options: { funcName: string; argument: string }) {}
  JS_Resize(width: number, height: number) {}
}
