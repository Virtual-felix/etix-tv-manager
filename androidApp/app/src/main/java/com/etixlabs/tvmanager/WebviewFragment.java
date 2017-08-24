package com.etixlabs.tvmanager;

import android.annotation.SuppressLint;
import android.app.Fragment;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class WebviewFragment extends Fragment {

  /**
   * Set to true and see {@link #dispatchKeyEvent(KeyEvent)} to intercept remote key press
   */
  public static final boolean INTERCEPT_REMOTE_PRESS = true;
  public static final String JAVA_BRIDGE_NAME = "TVManager";

  private WebView webview;

  @Nullable
  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle
      savedInstanceState) {
    return inflater.inflate(R.layout.webview_view, container, false);
  }

  @SuppressLint("SetJavaScriptEnabled")
  @Override
  public void onViewCreated(View view, Bundle savedInstanceState) {
    super.onViewCreated(view, savedInstanceState);
    webview = (WebView) view.findViewById(R.id.webview);
    WebviewBridge webViewBridge = new WebviewBridge(NetworkUtil.getIPAddress(true),
        (WebViewActivity) getActivity());
    webview.addJavascriptInterface(webViewBridge, JAVA_BRIDGE_NAME);

    WebSettings settings;
    settings = webview.getSettings();

    settings.setJavaScriptEnabled(true);
    settings.setJavaScriptCanOpenWindowsAutomatically(true);
    settings.setDomStorageEnabled(true);
    webview.setWebViewClient(new WebViewClient());
    webview.setWebChromeClient(new WebChromeClient());

    webview.loadUrl("http://192.168.200.30:3042");
//    webview.loadUrl("javascript:alert(TVManager.getIp())");
  }


  /**
   * If you want to handle remotes key presses:
   * 1) set {@link #INTERCEPT_REMOTE_PRESS} to true <br/>
   * 2) implement onRemoteKeyPress(int keycode) in your javascript. <br/>
   * 3) back will be then blocked. You can ask the app to react to back by calling {@link WebviewBridge#pressBack()} <br/>
   *
   * <p>
   * Here is the keycode you can resolve
   * up 19, down 20, left 21, right 22, select 23, back 4,
   */
  public boolean dispatchKeyEvent(KeyEvent event) {
    webview.loadUrl("javascript:onRemoteKeyPress(" + event.getKeyCode() + ");");
    Toast.makeText(getActivity(), "" + event.getKeyCode(), Toast.LENGTH_SHORT).show();
    return INTERCEPT_REMOTE_PRESS;
  }

}
