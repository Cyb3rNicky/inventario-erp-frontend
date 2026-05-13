import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../services/Auth/login';
import { setAuth } from '../utils/auth';

import Logo from '../assets/umg250x250.svg';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ userName: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setSubmitting(true);

      // 1) Intentar login real (cuando exista / funcione)
      try {
        const { token, user } = await login({
          userName: form.userName,
          password: form.password,
        });

        setAuth({ token, user });
        navigate(from, { replace: true });
        return;
      } catch (errReal) {
        // 2) Temporal: si falla, permitir acceso con cualquier credencial
        const fakeToken = 'DEV_DUMMY_TOKEN';
        const fakeUser = {
          userName: form.userName,
          roles: [], // o ["admin"] si quieres simular admin
        };

        setAuth({ token: fakeToken, user: fakeUser });
        navigate(from, { replace: true });
        return;
      }
    } catch (err) {
      setError(err?.message || 'No se pudo iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img src={Logo} className="h-24 w-auto" alt="UMG" />
            <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">
              Inicia sesión
            </h2>
          </div>

          <div className="mt-10">
            <form onSubmit={onSubmit} className="space-y-6">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="userName" className="block text-sm/6 font-medium text-gray-900">
                  Usuario
                </label>
                <div className="mt-2">
                  <input
                    id="userName"
                    name="userName"
                    type="text"
                    required
                    autoComplete="username"
                    value={form.userName}
                    onChange={onChange}
                    disabled={submitting}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6 disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Contraseña
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={form.password}
                    onChange={onChange}
                    disabled={submitting}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6 disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-800 disabled:opacity-50"
                >
                  {submitting ? 'Ingresando…' : 'Ingresar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1768796373552-1168cb598645?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
    </div>
  );
}