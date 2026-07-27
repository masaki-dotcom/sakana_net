## venvのインストール

- フォルダを作成（例）  
  :testフォルダを作成する

```
py -3.8 -m venv test
```
```
cd test\Scripts  
activate
```
pythonの環境に入れる
```
(venv_38) D:\Masaki_Yoneno\test\Scripts>
```

## voltaのインストール

参考資料
https://note.com/rurai/n/n47a3fb9c4508

https://note.com/rurai/n/n47a3fb9c4508


## voltaのDefaultバージョンを指定する方法
```
volta install node@16.20.2
volta install node@20.14.0
volta install node@22.21.1
```


## nodeのリストを確認する
```
volta list node
```


## フォルダ単位でバージョンを指定する
```
npm init
```

```
volta pin node@20.14.0
```

フォルダのバージョンを確認する

```
node -v
```
