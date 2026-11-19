/// <reference types="node" />
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const escapeHtml = (str: string): string =>
  String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
  });

  app.use(express.json({ limit: '1mb' }));

  const normalizeInvitationCode = (code?: unknown): string =>
    String(code || '')
      .replace(/[\s\u200B-\u200D\uFEFF]/g, '')
      .trim()
      .toUpperCase();

  const normalizeGroupKey = (nameOrKey?: unknown): string => {
    const raw = String(nameOrKey || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return raw || 'default';
  };

  interface SharedGroupSettings {
    groupKey: string;
    groupName?: string;
    parishName?: string;
    logoUrl?: string;
    invitationCode?: string;
    bannerPalette?: string;
    bannerImageUrl?: string;
    bannerImageOpacity?: number;
    updatedAt?: string;
  }

  const sharedGroupsMap: Record<string, SharedGroupSettings> = {};
  let latestGroupKey = '';

  const toPublicSummary = (g: SharedGroupSettings) => ({
    groupKey: g.groupKey,
    groupName: g.groupName,
    parishName: g.parishName,
    logoUrl: g.logoUrl,
    bannerPalette: g.bannerPalette,
    bannerImageUrl: g.bannerImageUrl,
    bannerImageOpacity: g.bannerImageOpacity,
    hasInvitationCode: Boolean(g.invitationCode),
    updatedAt: g.updatedAt,
  });

  app.get('/api/group-settings', (req, res) => {
    const reqKeyRaw = req.query?.groupKey || req.query?.groupName;
    const targetKey = reqKeyRaw ? normalizeGroupKey(reqKeyRaw) : latestGroupKey;
    const selected = targetKey ? sharedGroupsMap[targetKey] : undefined;
    const groups = Object.values(sharedGroupsMap).map(toPublicSummary);

    res.json({
      ok: true,
      hasInvitationCode: Boolean(selected?.invitationCode),
      groupKey: selected?.groupKey,
      groupName: selected?.groupName,
      parishName: selected?.parishName,
      logoUrl: selected?.logoUrl,
      bannerPalette: selected?.bannerPalette,
      bannerImageUrl: selected?.bannerImageUrl,
      bannerImageOpacity: selected?.bannerImageOpacity,
      groups,
    });
  });

  app.post('/api/group-settings', (req, res) => {
    const body = req.body || {};
    const resolvedKey = normalizeGroupKey(body.groupKey || body.groupName || latestGroupKey || 'default');
    const existing: SharedGroupSettings = sharedGroupsMap[resolvedKey] || { groupKey: resolvedKey };

    const nextCode =
      typeof body.invitationCode === 'string' && normalizeInvitationCode(body.invitationCode)
        ? normalizeInvitationCode(body.invitationCode)
        : existing.invitationCode;

    const updated: SharedGroupSettings = {
      ...existing,
      groupKey: resolvedKey,
      ...(typeof body.groupName === 'string' && body.groupName.trim() ? { groupName: body.groupName.trim() } : {}),
      ...(typeof body.parishName === 'string' && body.parishName.trim() ? { parishName: body.parishName.trim() } : {}),
      ...(typeof body.logoUrl === 'string' && body.logoUrl.trim() ? { logoUrl: body.logoUrl } : {}),
      ...(typeof body.bannerPalette === 'string' && body.bannerPalette.trim() ? { bannerPalette: body.bannerPalette } : {}),
      ...(typeof body.bannerImageUrl === 'string' ? { bannerImageUrl: body.bannerImageUrl } : {}),
      ...(typeof body.bannerImageOpacity === 'number' ? { bannerImageOpacity: body.bannerImageOpacity } : {}),
      ...(nextCode ? { invitationCode: nextCode } : {}),
      updatedAt: new Date().toISOString(),
    };

    sharedGroupsMap[resolvedKey] = updated;
    latestGroupKey = resolvedKey;
    res.json({ ok: true, groupKey: resolvedKey });
  });

  app.post('/api/verify-invitation-code', (req, res) => {
    const entered = normalizeInvitationCode(req.body?.code);
    const requestedKeyRaw = req.body?.groupKey || req.body?.groupName;
    const requestedKey = requestedKeyRaw ? normalizeGroupKey(requestedKeyRaw) : '';

    let target = requestedKey ? sharedGroupsMap[requestedKey] : undefined;
    if (!target && requestedKeyRaw) {
      const byNameKey = normalizeGroupKey(req.body?.groupName);
      target =
        sharedGroupsMap[byNameKey] ||
        Object.values(sharedGroupsMap).find(
          (g) => g.groupName && normalizeGroupKey(g.groupName) === requestedKey
        );
    }
    if (!target && !requestedKeyRaw && latestGroupKey) {
      target = sharedGroupsMap[latestGroupKey];
    }

    const active = normalizeInvitationCode(target?.invitationCode);
    if (!active) {
      res.json({ configured: false, valid: false, groupKey: requestedKey || undefined });
      return;
    }
    res.json({
      configured: true,
      valid: Boolean(entered && entered === active),
      groupKey: target?.groupKey,
    });
  });

  app.post('/api/send-password-reminder', async (req, res) => {
    try {
      const { email, name, password, cedula, groupName, parishName } = req.body || {};
      const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
      const cleanName = typeof name === 'string' ? name.trim() : 'Integrante';
      const cleanPassword = typeof password === 'string' ? password.trim() : '';
      const cleanCedula = typeof cedula === 'string' ? cedula.trim() : '';
      const cleanGroup = typeof groupName === 'string' && groupName.trim() ? groupName.trim() : 'JMV';
      const cleanParish = typeof parishName === 'string' ? parishName.trim() : 'Juventud Mariana Vicenciana';

      if (!cleanEmail || !cleanEmail.includes('@') || !cleanPassword) {
        res.status(400).json({ ok: false, delivered: false, error: 'Datos incompletos para enviar el correo.' });
        return;
      }

      const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
      const resendFrom = (process.env.RESEND_FROM_EMAIL || `${cleanGroup} <onboarding@resend.dev>`).trim();

      if (resendApiKey) {
        const htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
            <div style="background: #1e3a8a; color: #ffffff; padding: 20px 24px;">
              <h2 style="margin: 0; font-size: 18px;">${escapeHtml(cleanGroup)}</h2>
              <p style="margin: 4px 0 0; font-size: 12px; color: #fde68a;">${escapeHtml(cleanParish)} · Recordatorio de Acceso</p>
            </div>
            <div style="padding: 24px; color: #1e293b; font-size: 14px; line-height: 1.5;">
              <p>Hola <strong>${escapeHtml(cleanName)}</strong>,</p>
              <p>Solicitaste recordar tus datos de ingreso a la plataforma de tu comunidad:</p>
              <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; margin: 16px 0;">
                <p style="margin: 0 0 6px;"><strong>Correo:</strong> ${escapeHtml(cleanEmail)}</p>
                <p style="margin: 0 0 6px;"><strong>Cédula:</strong> ${escapeHtml(cleanCedula)}</p>
                <p style="margin: 0;"><strong>Contraseña actual:</strong> <code style="background: #e0e7ff; color: #1e3a8a; padding: 2px 6px; border-radius: 6px; font-weight: bold;">${escapeHtml(cleanPassword)}</code></p>
              </div>
              <p style="font-size: 12px; color: #64748b;">Por seguridad, no compartas este correo con otras personas.</p>
            </div>
          </div>
        `;

        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: resendFrom,
            to: [cleanEmail],
            subject: `Recordatorio de contraseña · ${cleanGroup}`,
            html: htmlBody,
          }),
        });

        if (response.ok) {
          res.json({ ok: true, delivered: true, provider: 'resend' });
          return;
        }

        const errText = await response.text().catch(() => '');
        console.warn('Resend API returned non-OK:', response.status, errText);
        res.json({
          ok: true,
          delivered: false,
          reason: 'EMAIL_PROVIDER_REJECTED',
          details: errText,
        });
        return;
      }

      const webhookUrl = (process.env.EMAIL_WEBHOOK_URL || '').trim();
      if (webhookUrl) {
        const hookRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: cleanEmail,
            name: cleanName,
            password: cleanPassword,
            cedula: cleanCedula,
            groupName: cleanGroup,
            parishName: cleanParish,
            subject: `Recordatorio de contraseña · ${cleanGroup}`,
          }),
        });
        if (hookRes.ok) {
          res.json({ ok: true, delivered: true, provider: 'webhook' });
          return;
        }
      }

      res.json({
        ok: true,
        delivered: false,
        reason: 'NO_EMAIL_PROVIDER_CONFIGURED',
      });
    } catch (error) {
      console.error('Error in /api/send-password-reminder:', error);
      res.status(500).json({ ok: false, delivered: false, error: 'Error interno al procesar el recordatorio.' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
