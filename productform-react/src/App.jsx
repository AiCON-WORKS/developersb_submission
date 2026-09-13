import { useEffect, useMemo, useState } from 'react'
import './App.css'

const PRODUCT_MANAGEMENT_API_URL = '/api/product-management'
const PRODUCT_REGISTRATION_API_URL = '/api/product-registration'
const AUTH_STATUS_URL = '/api/auth/status'
const LOGIN_URL = '/api/login'
const LOGOUT_URL = '/api/logout'

//auth:ログイン状態、onLogout:ログアウトの処理、loginOnly:ログイン状態の画面切替え
//ログイン画面で無い時にHeaderを表示

function Header({ auth, onLogout, loginOnly = false }) {
  return (
      <header className="topbar">
        <a className="brand" href="/product-management">仕入品管理リスト</a>
        {!loginOnly && (
            <nav className="nav">
              {auth.isAdmin && <a href="/product-management">一覧</a>}
              {auth.isAdmin && <a href="/product-registration">登録</a>}
              {auth.authenticated && (
                  <form onSubmit={onLogout}>
                    <button type="submit">ログアウト</button>
                  </form>
              )}
            </nav>
        )}
      </header>
  )
}

//ログイン画面
function LoginPage({ auth }) {
  const params = new URLSearchParams(window.location.search)
  const hasLogout = params.has('logout')
  const [loginError, setLoginError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const login = async (event) => {
    event.preventDefault()
    setLoginError(false)

    const formData = new FormData(event.currentTarget)
    const body = new URLSearchParams(formData)

    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body,
      })

      if (!response.ok) {
        setLoginError(true)
        return
      }

      window.location.href = '/product-management'
    } catch {
      setLoginError(true)
    }
  }

  return (
      <>
        <Header auth={auth} loginOnly />
        <main className="container narrow">
          <section className="page-head">
            <h1>ログイン</h1><br />
          </section>

          <form className="form" onSubmit={login}>
            {loginError && <p className="alert">ユーザー名またはパスワードが違います。</p>}
            {hasLogout && <p className="notice">ログアウトしました。</p>}

            <label>
              ユーザー名
              <input name="username" autoComplete="username" placeholder="ユーザー名を入力してください" required />
            </label>

            <label>
              パスワード
              <div className="password-field">
                <input
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="パスワードを入力してください"
                    required
                />
              </div>
            </label>

            <button type="submit">ログイン</button>
          </form>
        </main>
      </>
  )
}

//商品登録画面
function ProductManagement({products}) {
  return (
      <table>
        <thead>
        <tr>
          <th>仕入名</th>
          <th>仕入価格</th>
          <th>定価</th>
          <th>仕入先</th>
          <th>メーカー</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td><span>¥</span><span>{product.cost.toLocaleString()}</span></td>
              <td><span>¥</span><span>{product.list.toLocaleString()}</span></td>
              <td>{product.supplier}</td>
              <td>{product.manufacturer}</td>
            </tr>
        ))}
        </tbody>
      </table>
  )
}

// 商品登録画面
function ProductRegistration({ onCreated }) {
  const [form, setForm] = useState({
    name: '',
    cost: '',
    list: '',
    supplier: '',
    manufacturer: '',
  })

  // submittingに対するステート管理
  const [submitting, setSubmitting] = useState(false)

　　//要素の値が変更された時の処理(updateForm)
    const updateForm = (event) => {
    const { name, value} = event.target
    //現在のフォームの入力状況をコピーして、要素の変更の値のみを変更
    setForm((current) => ({
      ...current,
      [name]:value,
    }))
  }

  // ボタンを押下した際の商品登録処理
  const submitProduct = async (event) => {
    // リロードしない
    event.preventDefault()
    // ボタン非活性のまま登録
    setSubmitting(true)

    await onCreated({
      name: form.name,
      cost: Number(form.cost),
      list: Number(form.list),
      supplier:form.supplier,
      manufacturer:form.manufacturer
    })

    setSubmitting(false)
  }

  return (
      <form className="form" onSubmit={submitProduct}>
        <label>
          商品名
          <input
              name="name"
              value={form.name}
              onChange={updateForm}
              placeholder="商品名を入力してください"
              required
          />
        </label>

        <label>
          仕入価格
          <input
              name="cost"
              type="number"
              value={form.cost}
              onChange={updateForm}
              placeholder="仕入価格を入力してください"
              required
          />
        </label>

        <label>
          定価
          <input
              name="list"
              type="number"
              value={form.list}
              onChange={updateForm}
              placeholder="定価を入力してください"
              required
          />
        </label>

        <label>
          仕入先
          <input
              name="supplier"
              value={form.supplier}
              onChange={updateForm}
              placeholder="仕入先を入力してください"
              required
          />
        </label>

        <label>
          メーカー
        <input
            name="manufacturer"
            value={form.manufacturer}
            onChange={updateForm}
            placeholder="メーカーを入力してください"
            required
        />
      </label>
        <button type="submit" disabled={submitting}>
          {submitting ? '登録中...' : '登録する'}
        </button>
      </form>
  )
}


function App() {
  // ログイン状態を確認する
  const [auth, setAuth] = useState({
    // ログイン状態か
    authenticated: false,
    // ユーザーネーム
    username: null,
    // 管理者ユーザかどうか
    isAdmin: false,
  })

  // 商品データのステート管理
  const [products, setProducts] = useState([])
  // エラーメッセージ
  const [message, setMessage] = useState('')
  // 読み込み状態
  const [loading, setLoading] = useState(true)
  // // 権限エラーを表示するかどうかの管理
  const [accessDenied, setAccessDenied] = useState(false)
  // ブラウザで表示しているURL
  const path = window.location.pathname
  // ブラウザに表示されているクエリパラメータを取得
  const params = new URLSearchParams(window.location.search)
  // registrationが存在する場合はtrueで返す判定用
  const registrationFlag = params.get('registration') === 'true'
  // 管理者権限用のページか判定用の管理
  const adminOnlyPage = path === '/product-management' || path === '/product-registration'

  // pageTiteはブラウザに表示されているURLによってタイトルを切り替える
  const pageTitle = useMemo(() => {
    if (path === '/product-management') {
      return '仕入実績一覧'
    }

    if (path === '/product-registration') {
      return '新規登録'
    }

    // return '商品一覧'
  }, [path])

  // ログイン状態を確認する(loadAuth)
  const loadAuth = async () => {
    const guestAuth = {
      //ログイン状態か
      authenticated: false,
      // ユーザーネーム
      username: null,
      // 管理者権限であるROLE_ADMINか
      isAdmin: false,
    }

    try {
      const response = await fetch(AUTH_STATUS_URL, {
        credentials: 'include',
      })

      if (!response.ok) {
        setAuth(guestAuth)
        return guestAuth
      }

      const currentAuth = await response.json()
      setAuth(currentAuth)
      return currentAuth
    } catch {
      setAuth(guestAuth)
      return guestAuth
    }
  }

  // 管理者専用画面を表示してよいか確認して、
  // 管理者ユーザでログインしていない場合は権限エラー画面を表示する

  const denyUnauthorizedPage = (currentAuth) => {
    if (!adminOnlyPage) {
      setAccessDenied(false)
      return false
    }

    if (!currentAuth.isAdmin) {
      setAccessDenied(true)
      return true
    }

    setAccessDenied(false)
    return false
  }

// 画面の更新処理で商品一覧を取り出して、更新して再度新しい商品一覧を表示する
//   商品一覧画面では公開中の商品を取得し商品管理画面では全商品を取得する
  const loadProducts = async () => {
    setLoading(true)
    setMessage('')

    try {
      const url = path === '/product-management' && PRODUCT_MANAGEMENT_API_URL;
      const response = await fetch(url, {
        credentials: 'include',
      })
      setProducts(await response.json())

    } catch (error) {
      if (error instanceof TypeError) {
        setMessage('Spring Boot APIに接続できません。バックエンドが起動しているか確認してください。')
        return
      }

      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  // 商品登録を行う
  const createProduct = async (product) => {
    setMessage('')

    // fetchで対象URLのリクエストを送る
    try {
      const response = await fetch(PRODUCT_REGISTRATION_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(product),
      })

      //DBに商品が登録されて商品管理画面に遷移する
      window.location.href = '/product-management?registration=true'
    } catch (error) {
      if (error instanceof TypeError) {
        setMessage('Spring Boot APIに接続できません。バックエンドが起動しているか確認してください。')
        return
      }

      setMessage(error.message)
    }
  }

  // 公開と非公開を切り替える処理
  const togglePublished = async (product) => {
    setMessage('')

    try {
      const action = product.published ? 'hide' : 'publish'
      const response = await fetch(`${PRODUCT_MANAGEMENT_API_URL}/${product.id}/${action}`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`公開状態の更新に失敗しました。status: ${response.status}`)
      }
// 商品データの再読込みを行う
      await loadProducts()
    } catch (error) {
      if (error instanceof TypeError) {
        setMessage('Spring Boot APIに接続できません。バックエンドが起動しているか確認してください。')
        return
      }

      setMessage(error.message)
    }
  }

  // ログアウト処理
  const logout = async (event) => {
    event.preventDefault()

    try {
      await fetch(LOGOUT_URL, {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      window.location.href = '/login?logout'
    }
  }

  useEffect(() => {
    const initializePage = async () => {
      const currentAuth = await loadAuth()

      if (path === '/login' || denyUnauthorizedPage(currentAuth)) {
        return
      }

      if (path !== '/product-registration') {
        await loadProducts()
      }
    }

    initializePage()
  }, [path])
　
  // URLにloginが表示されている場合はログイン画面を表示する
  if (path === '/login') {
    return <LoginPage auth={auth} />
  }

  return (
      <>
        {/*ヘッダーを表示する*/}
        <Header auth={auth} onLogout={logout} />

        {/*表示されているURLに応じて、表示内容を切りかえる*/}
        <main className={path === '/product-registration' ? 'container narrow' : 'container'}>
          <section className={`page-head ${path === '/product-management' ? 'row' : ''}`}>
            {/*商品管理画面の場合*/}
            {path === '/product-management' ? (
                <>
                  <div>
                    <h1>{pageTitle}</h1>
                    {registrationFlag && <p className="notice registration-notice">商品を登録しました</p>}

                  </div>
                  <a className="button" href="/product-registration">商品を登録する</a>
                </>
                // 商品登録画面の場合
            ) : path === '/product-registration' ? (
                <div>
                  <h1>{pageTitle}</h1>
                </div>
            ) : null}

          </section>
          {/*エラーメッセージの表示について*/}
          {message && <p className="alert">{message}</p>}

          {/*パスに応じてどのコンポーネントを扱うか*/}
          {path === '/product-registration' ? (
              <ProductRegistration onCreated={createProduct} />
          ) : path === '/product-management' ? (
              <ProductManagement products={products} loading={loading}  />
          ) : null}
        </main>
      </>
  )
}

export default App
