package com.example.testapp

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val webView: WebView = findViewById(R.id.webview)

        webView.settings.javaScriptEnabled = true

        // Configuration du WebViewClient pour intercepter les liens
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: android.webkit.WebResourceRequest?): Boolean {
                // Charger l'URL dans la WebView actuelle
                view?.loadUrl(request?.url.toString())
                return true
            }
        }

        // Chargement de l'URL initiale
        webView.loadUrl("https://godefroyl.github.io/test_site_static/")
    }
}
