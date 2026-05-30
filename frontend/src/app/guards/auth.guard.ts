import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map } from 'rxjs/operators';

import { AuthSessionService, SessaoUsuario } from '../services/auth-session.service';

type PerfilPermitido = SessaoUsuario['perfil'] | undefined;

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const authSessionService = inject(AuthSessionService);
  const perfilPermitido = (route.data?.['perfil'] ?? route.parent?.data?.['perfil']) as PerfilPermitido;

  return authSessionService.verificarSessao().pipe(
    map((usuario): boolean | UrlTree => {
      if (!usuario) {
        authSessionService.limparSessaoLocal();
        return router.createUrlTree(['/login']);
      }

      authSessionService.sincronizarSessaoLocal(usuario);

      if (perfilPermitido && usuario.perfil !== perfilPermitido) {
        return router.createUrlTree([authSessionService.rotaPadraoPorPerfil(usuario.perfil)]);
      }

      return true;
    })
  );
};
