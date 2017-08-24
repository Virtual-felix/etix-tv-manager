package com.etixlabs.tvmanager;

import android.content.Intent;
import android.webkit.JavascriptInterface;

/**
 * Methode precided by {@link JavascriptInterface} are callable by the javascript webview <br/>
 * Calling {@value WebviewFragment#JAVA_BRIDGE_NAME}.getIp() int js will then return the ip.
 */
public class WebviewBridge {
  String ip;
  WebViewActivity activity;

  public WebviewBridge(String ip, WebViewActivity activity) {
    this.ip = ip;
    this.activity = activity;
  }

  @JavascriptInterface
  public String getIp() {
    return ip;
  }

  /**
   * Start an other app <br/>
   * {@code TVManager.startActivity("com.google.android.youtube.tv")}
   *
   * @param packageName the name of the package of the app to launch   *
   *                    You can find app available on the tv by using <br/>
   *                    {@code adb shell 'pm list packages -f'}
   */
  @JavascriptInterface
  public void startActivity(String packageName) {
    Intent launchIntent = activity.getPackageManager().getLaunchIntentForPackage
        (packageName);
    activity.startActivity(launchIntent);
  }

  @JavascriptInterface
  public void pressBack() {
    activity.onBackPressed();
  }

}
