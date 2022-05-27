---
title: Forward Proxy vs Reverse Proxy
date: 2022-02-09 16:05:18
category: Architecture
thumbnail: { thumbnailSrc }
draft: false
---

사용자가 www.google.com에 연결하려고 하면 사용자 pc가 직접 연결하는 게 아니라 Forward Proxy Server가 요청을 받아
www.google.com에 연결하여 그 결과를 클라이언트에게 forward 해줍니다.

forward 프록시는 캐싱 기능이 있어 자주 사용되는 컨텐츠라면 월등한 성능 향상을 가져올 수 있으며 
정해진 사이트만 연결하게 설정하는 등 웹 사용 환경을 제한할 수 있어 보안이 매우 중요한 기업 환경 등에서 많이 사용합니다.

![image2021-6-2_8-52-56](https://user-images.githubusercontent.com/67765871/153542110-6c4c2c50-1310-4a2e-bf49-2208d523999c.png)

## Reverse Proxy

우선 Reverse Proxy 서버는 **로드 밸런싱**에 사용됩니다. Reverse Proxy 서버를 여러 개의 서버 앞에 두면 특정 서버가 과부화 되지 않게 로드 밸런싱이 가능합니다.  

또한, 보안에 좋습니다. **본래 서버의 IP 주소를 노출시킬 필요가 없습니다.**  

성능 향상을 위해 **캐시** 데이터를 저장할 수 있습니다. 만약 한국 유저가 미국에 웹서버를 두고 있는 사이트에 접속할 때, 리버스 프록시 서버가 한국에 있다고 가정 해봅시다. 그럼 한국 유저는 한국에 있는 리버스 프록시 서버와 통신합니다. **리버스 프록시 서버에 캐싱돼 있는 데이터를 사용**할 경우에 더 빠른 성능을 보여줍니다.  

마지막으로 **SSL 암호화**에 좋습니다. 본래 서버가 클라이언트들과 통신을 할 때 SSL로 암호화, 복호화를 할 경우 비용이 많이 듭니다. 그러나 리버스 프록시를 사용하면 **들어오는 요청 모두 복호화하고 나가는 응답을 암호화 하기 때문에 클라이언트와 안전한 통신**을 할 수 있으며 본래 서버의 부담을 줄여줍니다.


![image2021-6-2_8-54-19](https://user-images.githubusercontent.com/67765871/153542078-3ea84ba2-d988-43b6-abd0-9fc555ca8a11.png)



