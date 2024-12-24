<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
const webControl = ref<WebControl | null>(null);
const msg = ref("");
const initCount = ref(0);
const pubKey = ref("");
onMounted(() => {
  initPlugin();
});

onUnmounted(() => {
  if (webControl.value != null) {
    webControl.value.JS_HideWnd();
    webControl.value.JS_Disconnect();
  }
});
function initPlugin() {
  msg.value = "正在加载中";
  webControl.value = new WebControl({
    szPluginContainer: "playWnd",
    iServicePortStart: 15900,
    iServicePortEnd: 15909,
    szClassId: "23BF3B0A-2C56-4D97-9C03-0CB103AA8F11",
    cbConnectSuccess: () => {
      initCount.value = 0;
      setCallbacks();
      webControl.value
        ?.JS_StartService("window", {
          dllPath: "./VideoPluginConnect.dll",
        })
        .then(() => {
          webControl.value?.JS_CreateWnd("playWnd", 800, 400).then(() => {
            console.log("JS_CreateWnd success");
            getPubKey(() => {
              init();
            });
          });
        });
    },
    cbConnectError: () => {
      console.log("cbConnectError");
      msg.value = "插件未启动，正在尝试启动，请稍候...";
      webControl.value?.JS_WakeUp("VideoWebPlugin://");
      initCount.value++;
      if (initCount.value < 3) {
        setTimeout(() => {
          initPlugin();
        }, 3000);
      } else {
        msg.value = "插件启动失败，请检查插件是否安装！";
        webControl.value = null;
      }
    },
    cbConnectClose: () => {
      webControl.value = null;
    },
  });
}
function setCallbacks() {
  webControl.value?.JS_SetWindowControlCallback({
    cbIntegrationCallBack: (data) => {
      console.log(data.responseMsg);
    },
  });
}
function getPubKey(callback: () => void) {
  webControl.value
    ?.JS_RequestInterface({
      funcName: "getRSAPubKey",
      argument: JSON.stringify({
        keyLength: 1024,
      }),
    })
    .then((oData: any) => {
      if (oData.responseMsg.data) {
        pubKey.value = oData.responseMsg.data;
        callback();
      }
    });
}
function setEncrypt(value: string) {
  // @ts-ignore
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(pubKey.value);
  return encrypt.encrypt(value);
}
function init() {
  let secret = setEncrypt("xxxx");
  webControl.value
    ?.JS_RequestInterface({
      funcName: "init",
      argument: JSON.stringify({
        appkey: "xxxxx",
        secret: secret,
        ip: "xxxxx",
        playMode: 0,
        port: 443,
        encryptedFields: "secret",
        language: "zh_CN",
        layout: "1x2",
        showSmart: 0,
        showToolbar: 0,
      }),
    })
    .then((data) => {
      console.log(data);

      webControl.value?.JS_Resize(800, 400);
    });
}

function startPreview() {
  webControl.value
    ?.JS_RequestInterface({
      funcName: "startPreview",
      argument: JSON.stringify({
        cameraIndexCode: "xxxx", //你的监控点编号
        gpuMode: 0,
        streamMode: 0,
        transMode: 1,
        wndId: 1,
      }),
    })
    .then(function (oData: any) {
      console.log(oData);
    });
}
defineExpose({
  startPreview,
});
</script>
<template>
  <div id="playWnd">{{ msg }}</div>
</template>
<style lang="css" scoped>
#playWnd {
  width: 800px;
  height: 400px;
}
</style>
