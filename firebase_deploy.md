## Fierebase 公開方法

firebase-toolsのインストール  
```
npm install -g firebase-tools
```  

Firebaseコマンドの実施 (以下のコマンドでログイン)
```
firebase login
```
＊注意エラーが出る場合は以下を実行してみる。  
about_Execution_Policies」(https://go.microsoft.com/fwlink/?LinkID=135170) を参照してください。 発生場所 行:1 文字:1 + firebase --version + ~~~~~~~~ + CategoryInfo : セキュリティ エラー: (: ) []、PSSecurityException> + FullyQualifiedErrorId : UnauthorizedAccess

```
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser
```

プロジェクトのビルド(distフォルダにビルドする)
```
npm run build
npm run generate
```

firebaseにデプロイする
```
firebase deploy
```


### Volta の修復解決手順　　
```
volta uninstall firebase-tools
```
Volta のキャッシュを消す

```
volta clean
```

firebase-tools を再インストール
```
npm install -g firebase-tools
```
firebase.json正しい設定
```
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

```
npm run build
npm run generate
```

```
firebase deploy
```

質問    意味    推奨（Nuxt の場合）
Overwrite public/index.html?    public/index.html を作り直す？  N
Set public directory to "public"?   "*"公開フォルダは public でいい？   No → dist に変更
Configure as single-page app?   SPA モード？    Yes
Use GitHub deploys? GitHub の自動デプロイ？ 任意
