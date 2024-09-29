# G-SHARK

G-SHARKは、入力された企業情報やインシデントの起点からチャットAIを用いてサイバー攻撃演習における訓練シナリオを自動作成するツールです。  
<p align="center">
    <img src="https://github.com/JinkaiCodeBlue2024/G-SHARK/blob/main/icon.png?raw=true" alt="icon" />
</p>

## スクリーンショット

![screenshot1](https://github.com/JinkaiCodeBlue2024/G-SHARK/blob/main/screenshot/screenshot1.png?raw=true)
![screenshot2](https://github.com/JinkaiCodeBlue2024/G-SHARK/blob/main/screenshot/screenshot2.png?raw=true)
![screenshot3](https://github.com/JinkaiCodeBlue2024/G-SHARK/blob/main/screenshot/screenshot3.png?raw=true)

## ローカルでビルドする方法

### GitHubからクローン

GitHubからクローンし、ディレクトリの中に移動します。
```sh
$ git clone git@github.com:JinkaiCodeBlue2024/G-SHARK.git
$ cd G-SHARK/
```

### 環境

- Python 3.11
- npm 9.8.1

### 事前準備

シナリオの生成でOpenAIのGPT-4 APIを使用しているため、API Keyを設定する必要があります。OpenAIのサイトでAPI Keyを取得し、環境変数として設定します。API Keyの取得方法の詳細については、「[Where do I find my Secret API Key?](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key)」を確認してください。  
  
1. シェルで環境変数を設定する方法
```sh
$ export OPENAI_API_KEY=YOUR_API_KEY
```
2. Dockerでコンテナに環境変数として渡す方法(詳細のコマンド形式は後述)
```sh
$ docker run --env OPENAI_API_KEY=YOUR_API_KEY
```

### バックエンドのビルド&実行

1. ローカルでインストールして実行する場合
```sh
$ cd backend/
$ pip install -r requirements.txt
$ uvicorn main:app --port 3000
```

2. Dockerを用いる場合
```sh
$ cd backend/
$ docker image build -t g-shark:v1 .
$ docker run -d -p 3000:8080 --name g-shark-api-server g-shark:v1 --env OPENAI_API_KEY=YOUR_API_KEY
```

### フロントエンドのビルド&実行

```sh
$ cd frontend/
$ npm install
$ npm run build
$ VITE_APP_BACKEND_ADDR=http://localhost:3000 npm run dev
```
