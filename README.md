# [WIP]
# G-SHARK

[G-SHARK](https://jinkai-libra-2023.web.app/)は、入力された情報からチャットAIを用いてサイバー攻撃演習における訓練シナリオを自動作成するツールです。  

[!screenshot1]()
[!screenshot2]()
[!screenshot3]()

## ローカルでビルドする方法

### 事前準備

シナリオの生成でOpenAIのGPT-4 APIを使用しているため、API Keyを設定する必要があります。OpenAIのサイトでAPI Keyを取得し、環境変数として設定します。API Keyの取得方法の詳細については、「[Where do I find my Secret API Key?](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key)」を確認してください。  
  
1. シェルで環境変数を設定する方法
```sh
$ export OPENAI_API_KEY=YOUR_API_KEY
```
2. Dockerでコンテナに環境変数として渡す方法
```sh
$ docker run --env OPENAI_API_KEY=YOUR_API_KEY
```

## ビルド

GitHubからクローンし、ディレクトリの中に移動します。
```sh
$ git clone git@github.com:JinkaiLibra2023/G-SHARK.git
$ cd G-SHARK/
```

### バックエンドのビルド&実行

1. ローカルで実行する場合
```sh
$ cd backend/
$ pip install -r requirements.txt
$ uvicorn main:app --port 5173
```

2. Dockerを用いる場合
```
$ cd backend/
$ docker image build -t g-shark:v1 .
$ docker run -d --name g-shark-api-server g-shark:v1
```

### フロントエンドのビルド&実行

```sh
$ cd frontend/
$ npm install
$ npm run build
$ npm run dev
```

