// @ts-nocheck
/* In-memory mock of the CarryMate Spring Boot API for demo builds (GitHub Pages).
   Call installMockApi() before rendering to intercept window.fetch for /api/**.
   Sample data only — nothing is saved. */
export function installMockApi(): void {
    var ME = {
      id: 1, name: 'Demo User', email: 'demo@carrymate.app', phone: '+91 98765 43210',
      travelerVerified: false, verificationStatus: 'NONE', ratingAvg: 0, ratingCount: 0,
    };
    var PRIYA = {
      id: 2, name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98111 22233',
      travelerVerified: true, verificationStatus: 'VERIFIED', ratingAvg: 4.8, ratingCount: 23,
    };
    var ARJUN = {
      id: 3, name: 'Arjun Mehta', email: 'arjun@example.com', phone: '+91 98989 76767',
      travelerVerified: false, verificationStatus: 'NONE', ratingAvg: 4.5, ratingCount: 6,
    };
    var SANA = {
      id: 4, name: 'Sana Khan', email: 'sana@example.com', phone: '+91 97654 32109',
      travelerVerified: true, verificationStatus: 'VERIFIED', ratingAvg: 4.9, ratingCount: 41,
    };
    var VIKRAM = {
      id: 5, name: 'Vikram Rao', email: 'vikram@example.com', phone: '+91 99444 55667',
      travelerVerified: true, verificationStatus: 'VERIFIED', ratingAvg: 4.6, ratingCount: 12,
    };
    var USERS = { 1: ME, 2: PRIYA, 3: ARJUN, 4: SANA, 5: VIKRAM };
  
    var DB = {
      trips: [
        { id: 1, traveler: PRIYA, fromCountry: 'India', fromCity: 'Hyderabad', toCountry: 'USA', toCity: 'New York', departureDate: '2026-11-15', arrivalDate: '2026-11-16', availableKg: 8, categories: 'electronics,fashion,perfume', commissionPct: 10, status: 'OPEN' },
        { id: 2, traveler: SANA, fromCountry: 'India', fromCity: 'Delhi', toCountry: 'UAE', toCity: 'Dubai', departureDate: '2026-11-02', arrivalDate: '2026-11-02', availableKg: 5, categories: 'perfume,fashion', commissionPct: 8, status: 'OPEN' },
        { id: 3, traveler: VIKRAM, fromCountry: 'India', fromCity: 'Mumbai', toCountry: 'UK', toCity: 'London', departureDate: '2026-11-20', arrivalDate: '2026-11-21', availableKg: 10, categories: 'electronics', commissionPct: 12, status: 'OPEN' },
        { id: 4, traveler: PRIYA, fromCountry: 'India', fromCity: 'Delhi', toCountry: 'India', toCity: 'Mumbai', departureDate: '2026-10-25', arrivalDate: '2026-10-25', availableKg: 15, categories: 'other', commissionPct: 5, status: 'OPEN' },
      ],
      requests: [
        { id: 1, shopper: ARJUN, productName: 'Nike Air Jordan 1 Retro', description: 'UK 9, Chicago colorway', buyCountry: 'USA', buyCity: 'New York', maxPrice: 180, currency: 'USD', quantity: 1, category: 'fashion', deliverCity: 'Hyderabad', deliverCountry: 'India', imageUrl: null, status: 'MATCHED' },
        { id: 2, shopper: ME, productName: 'iPhone 17 Pro 256GB', description: 'Unlocked, Natural Titanium', buyCountry: 'USA', buyCity: null, maxPrice: 1100, currency: 'USD', quantity: 1, category: 'electronics', deliverCity: 'Bengaluru', deliverCountry: 'India', imageUrl: null, status: 'OPEN' },
        { id: 3, shopper: ME, productName: 'Chanel Coco Mademoiselle 100ml', description: 'Eau de Parfum', buyCountry: 'UAE', buyCity: 'Dubai', maxPrice: 300, currency: 'USD', quantity: 1, category: 'perfume', deliverCity: 'Mumbai', deliverCountry: 'India', imageUrl: null, status: 'OPEN' },
        { id: 4, shopper: ARJUN, productName: 'Sony WH-1000XM5', description: 'Black', buyCountry: 'USA', buyCity: null, maxPrice: 350, currency: 'USD', quantity: 1, category: 'electronics', deliverCity: 'Delhi', deliverCountry: 'India', imageUrl: null, status: 'OPEN' },
      ],
      deals: [
        {
          id: 1, tripId: 1, requestId: 1, traveler: PRIYA, shopper: ARJUN,
          agreedProductPrice: 180, commissionAmount: 18, totalAmount: 198, currency: 'USD',
          status: 'IN_TRANSIT',
          events: [
            { status: 'PROPOSED', at: '2026-10-10T09:12:00', note: 'Shopper proposed: USD 198 total' },
            { status: 'ACCEPTED', at: '2026-10-10T14:40:00', note: 'Traveler accepted the deal' },
            { status: 'PURCHASED', at: '2026-10-12T18:05:00', note: 'Traveler marked purchased' },
            { status: 'IN_TRANSIT', at: '2026-11-15T22:30:00', note: 'Traveler marked in transit' },
          ],
          payment: { id: 1, amount: 198, currency: 'USD', status: 'HELD', gatewayRef: 'mock_pay_001' },
          createdAt: '2026-10-10T09:12:00', updatedAt: '2026-11-15T22:30:00',
        },
        {
          id: 2, tripId: 2, requestId: 3, traveler: SANA, shopper: ME,
          agreedProductPrice: 280, commissionAmount: 22, totalAmount: 302, currency: 'USD',
          status: 'PROPOSED',
          events: [
            { status: 'PROPOSED', at: '2026-10-16T11:20:00', note: 'Shopper proposed: USD 302 total' },
          ],
          payment: null,
          createdAt: '2026-10-16T11:20:00', updatedAt: '2026-10-16T11:20:00',
        },
      ],
      customs: [
        { id: 1, dealId: 1, itemsDescription: '1 pair Nike Air Jordan 1 sneakers', declaredValue: 180, currency: 'USD', estimatedDuty: 36, estimateRate: 0.20, travelerConfirmed: true },
      ],
      reviews: [
        { id: 1, dealId: 9, reviewer: ARJUN, reviewee: PRIYA, rating: 5, comment: 'Brought my sneakers in perfect condition, great communication throughout.' },
        { id: 2, dealId: 8, reviewer: SANA, reviewee: PRIYA, rating: 5, comment: 'Reliable traveler, highly recommended.' },
      ],
      verifications: [],
    };
  
    var seq = { trip: 10, request: 10, deal: 10, payment: 10, customs: 10, review: 10, verif: 10 };
  
    var DUTY = {
      India: { electronics: 0.28, fashion: 0.20, perfume: 0.30, other: 0.25 },
      USA: { electronics: 0.05, fashion: 0.08, perfume: 0.06, other: 0.05 },
      UAE: { electronics: 0.05, fashion: 0.05, perfume: 0.05, other: 0.05 },
      UK: { electronics: 0.12, fashion: 0.12, perfume: 0.10, other: 0.12 },
    };
  
    function findTrip(id) { return DB.trips.find(function (t) { return t.id === id; }); }
    function findReq(id) { return DB.requests.find(function (r) { return r.id === id; }); }
    function findDeal(id) { return DB.deals.find(function (d) { return d.id === id; }); }
    function dealDto(d) {
      var trip = findTrip(d.tripId), req = findReq(d.requestId);
      return {
        id: d.id, trip: trip, productRequest: req, traveler: d.traveler, shopper: d.shopper,
        agreedProductPrice: d.agreedProductPrice, commissionAmount: d.commissionAmount,
        totalAmount: d.totalAmount, currency: d.currency, status: d.status,
        events: d.events, payment: d.payment, createdAt: d.createdAt, updatedAt: d.updatedAt,
      };
    }
    function event(d, status, note) {
      d.events.push({ status: status, at: new Date().toISOString(), note: note });
      d.updatedAt = new Date().toISOString();
    }
    function json(data, status) {
      return new Response(JSON.stringify(data), {
        status: status || 200, headers: { 'Content-Type': 'application/json' },
      });
    }
    function err(msg, status) { return json({ error: msg }, status || 400); }
    function matchRoute(hay, needle) {
      if (!needle) return true;
      hay = (hay || '').toLowerCase(); needle = needle.toLowerCase();
      return hay.indexOf(needle) !== -1;
    }
  
    var origFetch = window.fetch.bind(window);
    window.fetch = function (url, init) {
      var u = String(url);
      if (u.indexOf('/api/') === -1) return origFetch(url, init);
      init = init || {};
      var method = (init.method || 'GET').toUpperCase();
      var path = u.slice(u.indexOf('/api/'));
      var qIndex = path.indexOf('?');
      var query = {};
      if (qIndex !== -1) {
        var usp = new URLSearchParams(path.slice(qIndex + 1));
        usp.forEach(function (v, k) { query[k] = v; });
        path = path.slice(0, qIndex);
      }
      var seg = path.split('/').filter(Boolean); // ['api', ...]
      var body = null;
      try { body = init.body ? JSON.parse(init.body) : null; } catch (e) { /* ignore */ }
  
      try {
        // ---- Auth ----
        if (seg[1] === 'auth' && seg[2] === 'register' && method === 'POST')
          return Promise.resolve(json({ id: 1, name: body.name || 'Demo User', email: body.email, token: 'mock-jwt-token' }));
        if (seg[1] === 'auth' && seg[2] === 'login' && method === 'POST')
          return Promise.resolve(json({ id: 1, name: 'Demo User', email: body.email, token: 'mock-jwt-token' }));
        if (seg[1] === 'auth' && seg[2] === 'me' && method === 'GET')
          return Promise.resolve(json({ id: 1, name: 'Demo User', email: 'demo@carrymate.app' }));
  
        // ---- Trips ----
        if (seg[1] === 'trips' && seg[2] === 'search' && method === 'GET') {
          var trips = DB.trips.filter(function (t) {
            return matchRoute(t.fromCountry + ' ' + (t.fromCity || ''), query.from) &&
                   matchRoute(t.toCountry + ' ' + (t.toCity || ''), query.to);
          });
          return Promise.resolve(json(trips));
        }
        if (seg[1] === 'trips' && seg[2] === 'mine' && method === 'GET')
          return Promise.resolve(json(DB.trips.filter(function (t) { return t.traveler.id === 1; })));
        if (seg[1] === 'trips' && method === 'POST') {
          var nt = {
            id: seq.trip++, traveler: ME, fromCountry: body.fromCountry, fromCity: body.fromCity || null,
            toCountry: body.toCountry, toCity: body.toCity || null, departureDate: body.departureDate,
            arrivalDate: body.arrivalDate || null, availableKg: body.availableKg ?? null,
            categories: body.categories || null, commissionPct: body.commissionPct ?? null, status: 'OPEN',
          };
          DB.trips.push(nt);
          return Promise.resolve(json(nt));
        }
        if (seg[1] === 'trips' && seg[2]) {
          var tid = parseInt(seg[2], 10), trip = findTrip(tid);
          if (!trip) return Promise.resolve(err('Trip not found', 404));
          if (method === 'GET') return Promise.resolve(json(trip));
          if (method === 'PUT') { Object.assign(trip, body); return Promise.resolve(json(trip)); }
          if (method === 'DELETE') { trip.status = 'CANCELLED'; return Promise.resolve(new Response(null, { status: 204 })); }
        }
  
        // ---- Requests ----
        if (seg[1] === 'requests' && seg[2] === 'search' && method === 'GET') {
          var reqs = DB.requests.filter(function (r) {
            return matchRoute(r.buyCountry, query.buyCountry) &&
                   matchRoute(r.category, query.category) &&
                   matchRoute(r.productName + ' ' + (r.description || ''), query.q);
          });
          return Promise.resolve(json(reqs));
        }
        if (seg[1] === 'requests' && seg[2] === 'mine' && method === 'GET')
          return Promise.resolve(json(DB.requests.filter(function (r) { return r.shopper.id === 1; })));
        if (seg[1] === 'requests' && method === 'POST') {
          var nr = {
            id: seq.request++, shopper: ME, productName: body.productName, description: body.description || null,
            buyCountry: body.buyCountry, buyCity: body.buyCity || null, maxPrice: body.maxPrice,
            currency: (body.currency || 'USD').toUpperCase(), quantity: body.quantity || 1,
            category: body.category || 'other', deliverCity: body.deliverCity || null,
            deliverCountry: body.deliverCountry || null, imageUrl: body.imageUrl || null, status: 'OPEN',
          };
          DB.requests.push(nr);
          return Promise.resolve(json(nr));
        }
        if (seg[1] === 'requests' && seg[2]) {
          var rid = parseInt(seg[2], 10), req = findReq(rid);
          if (!req) return Promise.resolve(err('Request not found', 404));
          if (method === 'GET') return Promise.resolve(json(req));
          if (method === 'PUT') { Object.assign(req, body); return Promise.resolve(json(req)); }
          if (method === 'DELETE') { req.status = 'CANCELLED'; return Promise.resolve(new Response(null, { status: 204 })); }
        }
  
        // ---- Deals ----
        if (seg[1] === 'deals' && seg.length === 2 && method === 'GET')
          return Promise.resolve(json(DB.deals.filter(function (d) {
            return d.traveler.id === 1 || d.shopper.id === 1;
          }).map(dealDto)));
        if (seg[1] === 'deals' && seg.length === 2 && method === 'POST') {
          var pt = findTrip(body.tripId), pr = findReq(body.requestId);
          if (!pt || !pr) return Promise.resolve(err('Trip or request not found', 404));
          var nd = {
            id: seq.deal++, tripId: pt.id, requestId: pr.id, traveler: pt.traveler, shopper: ME,
            agreedProductPrice: body.agreedProductPrice, commissionAmount: body.commissionAmount || 0,
            totalAmount: body.agreedProductPrice + (body.commissionAmount || 0),
            currency: (body.currency || 'USD').toUpperCase(), status: 'PROPOSED', events: [], payment: null,
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
          };
          event(nd, 'PROPOSED', 'Shopper proposed: ' + nd.currency + ' ' + nd.totalAmount + ' total');
          pr.status = 'MATCHED';
          DB.deals.push(nd);
          return Promise.resolve(json(dealDto(nd)));
        }
        if (seg[1] === 'deals' && seg[2]) {
          var did = parseInt(seg[2], 10), deal = findDeal(did);
          if (!deal) return Promise.resolve(err('Deal not found', 404));
          if (seg.length === 3 && method === 'GET') return Promise.resolve(json(dealDto(deal)));
          var action = seg[3];
          if (action === 'accept' && method === 'POST' && deal.status === 'PROPOSED') {
            deal.status = 'ACCEPTED'; event(deal, 'ACCEPTED', 'Traveler accepted the deal');
            return Promise.resolve(json(dealDto(deal)));
          }
          if (action === 'decline' && method === 'POST' && deal.status === 'PROPOSED') {
            deal.status = 'CANCELLED'; event(deal, 'CANCELLED', 'Traveler declined the proposal');
            findReq(deal.requestId).status = 'OPEN';
            return Promise.resolve(json(dealDto(deal)));
          }
          if (action === 'status' && method === 'POST') {
            var to = body.to;
            var ok = (to === 'PURCHASED' && deal.status === 'ACCEPTED') ||
                     (to === 'IN_TRANSIT' && deal.status === 'PURCHASED') ||
                     (to === 'DELIVERED' && deal.status === 'IN_TRANSIT');
            if (!ok) return Promise.resolve(err('Invalid transition', 400));
            if (to === 'PURCHASED' && (!deal.payment || deal.payment.status !== 'HELD'))
              return Promise.resolve(err('Hold payment in escrow first', 400));
            deal.status = to; event(deal, to, 'Marked ' + to.toLowerCase().replace('_', ' '));
            return Promise.resolve(json(dealDto(deal)));
          }
          if (action === 'confirm' && method === 'POST' && deal.status === 'DELIVERED') {
            deal.status = 'CONFIRMED'; event(deal, 'CONFIRMED', 'Shopper confirmed delivery; escrow released');
            if (deal.payment) deal.payment.status = 'RELEASED';
            findReq(deal.requestId).status = 'CLOSED';
            return Promise.resolve(json(dealDto(deal)));
          }
          if (action === 'cancel' && method === 'POST') {
            deal.status = 'CANCELLED'; event(deal, 'CANCELLED', 'Cancelled');
            if (deal.payment && deal.payment.status === 'HELD') deal.payment.status = 'REFUNDED';
            var rq = findReq(deal.requestId);
            if (rq.status === 'MATCHED') rq.status = 'OPEN';
            return Promise.resolve(json(dealDto(deal)));
          }
          return Promise.resolve(err('Invalid deal action', 400));
        }
  
        // ---- Payments ----
        if (seg[1] === 'payments' && seg[2] === 'hold' && method === 'POST') {
          var hd = findDeal(body.dealId);
          if (!hd) return Promise.resolve(err('Deal not found', 404));
          hd.payment = { id: seq.payment++, amount: hd.totalAmount, currency: hd.currency, status: 'HELD', gatewayRef: 'mock_pay_' + Date.now() };
          return Promise.resolve(json(hd.payment));
        }
        if (seg[1] === 'payments' && seg[2] === 'deal' && seg[3] && method === 'GET') {
          var pd = findDeal(parseInt(seg[3], 10));
          if (!pd || !pd.payment) return Promise.resolve(err('No payment', 404));
          return Promise.resolve(json(pd.payment));
        }
  
        // ---- Customs ----
        if (seg[1] === 'customs' && seg.length === 2 && method === 'POST') {
          var cd = findDeal(body.dealId);
          if (!cd) return Promise.resolve(err('Deal not found', 404));
          var tcountry = findTrip(cd.tripId).toCountry;
          var cat = findReq(cd.requestId).category || 'other';
          var table = DUTY[tcountry] || DUTY.India;
          var rate = table[cat] != null ? table[cat] : table.other;
          var nc = {
            id: seq.customs++, dealId: cd.id, itemsDescription: body.itemsDescription,
            declaredValue: body.declaredValue, currency: (body.currency || cd.currency).toUpperCase(),
            estimatedDuty: Math.round(body.declaredValue * rate * 100) / 100,
            estimateRate: rate, travelerConfirmed: false,
          };
          DB.customs.push(nc);
          return Promise.resolve(json(nc));
        }
        if (seg[1] === 'customs' && seg[3] === 'confirm' && method === 'POST') {
          var cc = DB.customs.find(function (c) { return c.id === parseInt(seg[2], 10); });
          if (!cc) return Promise.resolve(err('Declaration not found', 404));
          cc.travelerConfirmed = true;
          return Promise.resolve(json(cc));
        }
        if (seg[1] === 'customs' && seg[2] === 'deal' && seg[3] && method === 'GET') {
          var dc = DB.customs.find(function (c) { return c.dealId === parseInt(seg[3], 10); });
          if (!dc) return Promise.resolve(err('No declaration', 404));
          return Promise.resolve(json(dc));
        }
  
        // ---- Reviews & users ----
        if (seg[1] === 'reviews' && method === 'POST') {
          var rd = findDeal(body.dealId);
          var reviewee = rd.traveler.id === 1 ? rd.shopper : rd.traveler;
          var rv = { id: seq.review++, dealId: rd.id, reviewer: ME, reviewee: reviewee, rating: body.rating, comment: body.comment || null };
          DB.reviews.push(rv);
          return Promise.resolve(json(rv));
        }
        if (seg[1] === 'users' && seg[3] === 'reviews' && method === 'GET') {
          var uid = parseInt(seg[2], 10);
          return Promise.resolve(json(DB.reviews.filter(function (r) { return r.reviewee.id === uid; })));
        }
        if (seg[1] === 'users' && seg[2] && method === 'GET') {
          var u = USERS[parseInt(seg[2], 10)];
          return u ? Promise.resolve(json(u)) : Promise.resolve(err('User not found', 404));
        }
  
        // ---- Verification ----
        if (seg[1] === 'verification' && seg[2] === 'request' && method === 'POST') {
          var nv = { id: seq.verif++, userId: 1, docType: body.docType, docReference: body.docReference || null, status: 'PENDING' };
          DB.verifications.push(nv);
          ME.verificationStatus = 'PENDING';
          return Promise.resolve(json(nv));
        }
        if (seg[1] === 'verification' && seg[2] === 'mine' && method === 'GET')
          return Promise.resolve(json(DB.verifications));
  
        return Promise.resolve(err('mock: unhandled ' + method + ' ' + path, 404));
      } catch (e) {
        return Promise.resolve(err('mock error: ' + e.message, 500));
      }
    };
}
