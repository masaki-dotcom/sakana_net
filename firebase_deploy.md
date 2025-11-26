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
npm run generate
```

firebaseにデプロイする
```
firebase deploy
```