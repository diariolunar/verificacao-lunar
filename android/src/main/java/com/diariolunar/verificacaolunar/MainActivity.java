package com.diariolunar.verificacaolunar;

import android.app.Activity;
import android.graphics.Color;
import android.graphics.Insets;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowInsets;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
  private static final String APP_URL = "https://verificacao-lunar-89sx.vercel.app";
  private WebView webView;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    Window window = getWindow();
    window.setStatusBarColor(Color.rgb(16, 0, 31));
    window.setNavigationBarColor(Color.rgb(16, 0, 31));

    webView = new WebView(this);
    webView.setLayoutParams(new ViewGroup.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT,
      ViewGroup.LayoutParams.MATCH_PARENT
    ));
    webView.setBackgroundColor(Color.rgb(16, 0, 31));
    aplicarPaddingDasBarrasDoSistema(webView);

    WebSettings settings = webView.getSettings();
    settings.setJavaScriptEnabled(true);
    settings.setDomStorageEnabled(true);
    settings.setLoadWithOverviewMode(true);
    settings.setUseWideViewPort(true);

    webView.setWebViewClient(new WebViewClient());
    setContentView(webView);

    if (savedInstanceState == null) {
      webView.loadUrl(APP_URL);
    } else {
      webView.restoreState(savedInstanceState);
    }
  }

  private void aplicarPaddingDasBarrasDoSistema(View view) {
    view.setOnApplyWindowInsetsListener((target, insets) -> {
      int top;
      int bottom;

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        Insets systemBars = insets.getInsets(WindowInsets.Type.systemBars());
        top = systemBars.top;
        bottom = systemBars.bottom;
      } else {
        top = insets.getSystemWindowInsetTop();
        bottom = insets.getSystemWindowInsetBottom();
      }

      target.setPadding(0, top, 0, bottom);
      return insets;
    });
  }

  @Override
  protected void onSaveInstanceState(Bundle outState) {
    super.onSaveInstanceState(outState);
    webView.saveState(outState);
  }

  @Override
  public void onBackPressed() {
    if (webView != null && webView.canGoBack()) {
      webView.goBack();
      return;
    }

    super.onBackPressed();
  }
}
